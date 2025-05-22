import * as Plot from '@observablehq/plot';
import { Trans, useLingui } from '@lingui/react/macro';

import PlotFigure from './PlotFigure';

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

export function Cpr({ data }) {
  const { i18n } = useLingui();
  const ascentTypeColorDomain = {
    domain: ['flash', 'redpoint'],
    range: ['#ffd800', '#ff5151'],
  };

  return (
    <article>
      <h2>
        <Trans>Poor man's CPR</Trans>
      </h2>
      <p>
        <PlotFigure
          width={1200}
          options={{
            figure: true,
            grid: true,
            color: {
              legend: true,
              type: 'categorical',
              ...ascentTypeColorDomain,
            },
            width: 1200,
            x: {
              label: null,
              tickFormat: (d: Date, i) => {
                return i18n
                  .date(d, {
                    month: 'short',
                    ...(i === 0 || d.getUTCMonth() === 0
                      ? { year: 'numeric' }
                      : {}),
                  })
                  .replace(/\s+/g, '\n');
              },
            },
            y: {
              ticks: boulderScores
                .filter((grade) => grade.font <= '7C')
                .map((grade) => grade.score),
              tickFormat: (v) =>
                boulderScores.find(({ score }) => v === score)?.font,
              label: null,
            },
            style: {
              fontFamily: 'Inter',
              fontSize: 'var(--step--1)',
            },
            marginLeft: 80,
            marginRight: 100,
            marginBottom: 50,
            marks: [
              Plot.frame(),
              Plot.rectY(data, {
                interval: 'week',
                x: 'created_at',

                y1: 'numberDifficultyMin',
                y2: 'numberDifficultyMax',
                fill: 'type',

                title: (d) => {
                  if (d.difficultyMin === d.difficultyMax)
                    return d.difficultyMin;
                  return `${d.difficultyMin} - ${d.difficultyMax}`;
                },

                inset: 1,
                mixBlendMode: 'color-dodge',
              }),
            ],
          }}
        />
      </p>
    </article>
  );
}
