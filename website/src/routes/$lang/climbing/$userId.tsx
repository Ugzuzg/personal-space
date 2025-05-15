import { createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { Trans } from '@lingui/react/macro';
import fs from 'node:fs/promises';

import { Bar } from '~/components/Bar';
import { Completion } from '~/components/Completion';
import { Cpr } from '~/components/Cpr';
import { Timeline } from '~/components/Timeline';
import { CompletionHistory } from '~/components/CompletionHistory';

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

export const readDataFrame = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .inputValidator((userId: number) => userId)
  .handler(async (ctx) => {
    const pl = await import('nodejs-polars');
    const ascentsPath = `../data/ascents_${ctx.data}.jsonl`;

    try {
      await fs.stat(ascentsPath);
    } catch (e) {
      throw notFound();
    }

    let ascents = pl.readJSON(`../data/ascents_${ctx.data}.jsonl`, {
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
        ascents
          .getColumn('date')
          .str.strptime(pl.Datetime, '%Y-%m-%d %H:%M:%S %z')
          .cast(pl.Datetime('ms'))
          .alias('sent_at'),
        ascents.getColumn('ascendable_type').cast(pl.Categorical),
        ascents.getColumn('grading_system').cast(pl.Categorical),
        pl
          .col('difficulty')
          .replace({ old: gradeToNumber })
          .cast(pl.Float32)
          .alias('numberDifficulty'),
        pl.col('type').replace(['f', 'rp'], ['flash', 'redpoint']),
      )
      .withColumns(pl.col('created_at').date.year().alias('year'))
      // remove repeat ascents
      .unique({ subset: 'ascendable_id', keep: 'first' })
      // remove colored grades
      .filter(pl.col('difficulty').str.contains('tejp').not());

    let boulders = pl
      .readJSON('../data/gym_boulders.jsonl', {
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
        pl
          .col('created_at')
          .str.strptime(pl.Datetime, '%Y-%m-%d %H:%M:%S %z')
          .cast(pl.Datetime('ms'))
          .alias('boulder_created_at'),
        /**
         * Boulder's archived datetime can be computed from the updated_at datetime,
         * as it's the last time it was updated before becoming archived.
         */
        pl
          .when(pl.col('archived'))
          .then(pl.col('updated_at'))
          .otherwise(pl.lit(null))
          .str.strptime(pl.Datetime, '%Y-%m-%d %H:%M:%S %z')
          .cast(pl.Datetime('ms'))
          .alias('boulder_archived_at'),
      );

    let detailedAscents = ascents
      .join(boulders, {
        leftOn: 'ascendable_id',
        rightOn: 'nid',
      })
      .sort(pl.col('created_at'));

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
        pl.col('created_at').first().date.year().alias('year'),
        pl.col('created_at').first().date.week().alias('week'),
        pl.col('created_at').first().date.month().alias('month'),
        pl.col('numberDifficulty').sum().alias('totalNumberDifficulty'),
        pl.col('created_at').count().alias('count'),
        pl.col('difficulty'),
      )
      .toRecords();

    const bar = detailedAscents
      .select('difficulty', 'year', 'type', 'parent_name', 'route_setter')
      .toRecords();

    const solnaBoulders = boulders.filter(pl.col('gym_id').eq(pl.lit(69)));

    const completion = solnaBoulders
      .filter(pl.col('archived').eq(pl.lit(false)))
      .join(ascents, {
        how: 'left',
        leftOn: 'nid',
        rightOn: 'ascendable_id',
      })
      .groupBy('difficulty')
      .agg(
        pl.col('type').count().alias('sent'),
        pl.col('id').count().alias('all'),
        pl
          .col('type')
          .count()
          .cast(pl.Float64)
          .div(pl.col('id').count())
          .alias('completion'),
      )
      .toRecords();

    const start = new Date(2025, 2, 1);
    const completionHistory = solnaBoulders
      .filter(pl.col('gym_id').eq(pl.lit(69)))
      .join(ascents, {
        how: 'left',
        leftOn: 'nid',
        rightOn: 'ascendable_id',
      });

    const now = new Date();
    const completionHistoryRecords = [];
    for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
      const activeBoulders = completionHistory.filter(
        pl
          .col('boulder_created_at')
          .ltEq(pl.lit(d))
          .and(
            pl
              .col('boulder_archived_at')
              .gtEq(pl.lit(d))
              .or(pl.col('boulder_archived_at').isNull()),
          ),
      );
      const totalOnTheDay = activeBoulders.shape.height;
      const sentToTheDay = activeBoulders.filter(
        pl.col('sent_at').ltEq(pl.lit(d)),
      ).shape.height;
      completionHistoryRecords.push({
        date: new Date(d),
        totalOnTheDay,
        sentToTheDay,
      });
    }

    return {
      bar,
      cpr,
      timeline,
      completion,
      completionHistory: completionHistoryRecords,
    };
  });

export const Route = createFileRoute('/$lang/climbing/$userId')({
  loader: async (options) => {
    return await readDataFrame({ data: +options.params.userId });
  },
  component: RouteClimbing,
});

export function Climbing({
  cpr,
  timeline,
  bar,
  completion,
  completionHistory,
}: {
  cpr: any;
  timeline: any;
  bar: any;
  completion: any;
  completionHistory: any;
}) {
  return (
    <section>
      <h1>
        <Trans>Climbing</Trans>
      </h1>
      <Completion data={completion} />
      <CompletionHistory data={completionHistory} />
      <Cpr data={cpr} />
      <Timeline data={timeline} />
      <Bar data={bar} />
    </section>
  );
}

function RouteClimbing() {
  const { cpr, timeline, bar, completion, completionHistory } =
    Route.useLoaderData();

  return (
    <Climbing
      cpr={cpr}
      timeline={timeline}
      bar={bar}
      completion={completion}
      completionHistory={completionHistory}
    />
  );
}
