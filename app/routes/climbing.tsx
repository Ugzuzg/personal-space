import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import pl from 'nodejs-polars';
import { Bar } from '~/components/Bar';
import { Cpr } from '~/components/Cpr';
import { Timeline } from '~/components/Timeline';

const boulderScores = [
  { score: 12, v: 'VB', font: '2' },
  { score: 18, v: 'VB', font: '2+' },
  { score: 24, v: 'VB+', font: '3' },
  { score: 30, v: 'VB+', font: '3+' },
  { score: 36, v: 'V0-', font: '4' },
  { score: 42, v: 'V0', font: '4+' },
  { score: 48, v: 'V1', font: '5' },
  { score: 54, v: 'V2', font: '5+' },
  { score: 60, v: 'V3', font: '6a' },
  { score: 66, v: 'V3', font: '6a+' },
  { score: 72, v: 'V4', font: '6b' },
  { score: 78, v: 'V4', font: '6b+' },
  { score: 84, v: 'V5', font: '6c' },
  { score: 90, v: 'V5', font: '6c+' },
  { score: 96, v: 'V6', font: '7a' },
  { score: 102, v: 'V7', font: '7a+' },
  { score: 108, v: 'V7', font: '7b' },
  { score: 114, v: 'V8', font: '7b+' },
  { score: 120, v: 'V9', font: '7c' },
  { score: 126, v: 'V10', font: '7c+' },
].map((grade) => ({ ...grade, font: grade.font.toUpperCase() }));
const gradeToNumber = boulderScores.reduce((acc, grade) => {
  acc[grade.font] = grade.score;
  return acc;
}, {});

const readDataFrameServerFn = createServerFn({ type: 'static' }).handler(
  async () => {
    let ascents = pl.readJSON('./data/ascents_230474.jsonl', {
      inferSchemaLength: null,
      format: 'lines',
    });

    ascents = ascents
      .withColumns(
        ascents
          .getColumn('created_at')
          .str.strptime(pl.Datetime, '%Y-%m-%d %H:%M:%S %z')
          .cast(pl.Datetime('ms')),
        ascents
          .getColumn('updated_at')
          .str.strptime(pl.Datetime, '%Y-%m-%d %H:%M:%S %z')
          .cast(pl.Datetime('ms')),
        ascents.getColumn('ascendable_type').cast(pl.Categorical),
        ascents.getColumn('grading_system').cast(pl.Categorical),
      )
      .withColumns(pl.col('created_at').date.year().alias('year'))
      // remove repeat ascents
      .unique({ subset: 'ascendable_id', keep: 'first' });

    let boulders = pl
      .readJSON('./data/gym_boulders.jsonl', {
        inferSchemaLength: null,
        format: 'lines',
      })
      .withColumns(
        pl.col('route_card_label').str.slice(0, 3),
        pl
          .col('set_at')
          .str.strptime(pl.Datetime, '%Y-%m-%d %H:%M:%S %z')
          .cast(pl.Datetime('ms')),
        pl.col('id').alias('nid'),
      );

    let detailedAscents = ascents
      .join(boulders, {
        leftOn: 'ascendable_id',
        rightOn: 'nid',
      })
      .sort(pl.col('created_at'));
    detailedAscents = detailedAscents.withColumns(
      pl
        .col('difficulty')
        .replace({ old: gradeToNumber })
        .cast(pl.Float32)
        .alias('numberDifficulty'),
      pl.col('type').replace(['f', 'rp'], ['flash', 'redpoint']),
    );

    const cpr = detailedAscents
      .groupBy(
        pl.col('created_at').date.strftime('%Y-%U').alias('week'),
        'type',
      )
      .agg(
        pl.col('created_at').first(),
        pl.col('difficulty').min().alias('difficultyMin'),
        pl.col('difficulty').max().alias('difficultyMax'),
        pl.col('numberDifficulty').min().sub(3).alias('numberDifficultyMin'),
        pl.col('numberDifficulty').max().alias('numberDifficultyMax'),
        pl.col('created_at').count().alias('count'),
      )
      .toRecords();

    const timeline = detailedAscents
      .groupBy(pl.col('created_at').date.strftime('%Y-%U').alias('grouped'))
      .agg(
        pl.col('created_at').first().cast(pl.Date).alias('date'),
        pl.col('numberDifficulty').sum().alias('totalNumberDifficulty'),
        pl.col('created_at').count().alias('count'),
        pl.col('difficulty'),
      )
      .toRecords();

    return {
      detailedAscents: detailedAscents.toRecords(),
      cpr,
      timeline,
    };
  },
);

export const Route = createFileRoute('/climbing')({
  loader: async () => {
    return await readDataFrameServerFn();
  },
  component: Deferred,
});

async function Deferred() {
  const { cpr, timeline, detailedAscents } = Route.useLoaderData();

  return (
    <div>
      <h1>Climbing</h1>
      <p>Some climbing data to look at.</p>
      <h2>Timeline</h2>
      <Timeline data={timeline} />
      <h2>Poor man's CPR</h2>
      <Cpr data={cpr} />
      <h2>Bar</h2>
      <Bar data={detailedAscents} />
    </div>
  );
}
