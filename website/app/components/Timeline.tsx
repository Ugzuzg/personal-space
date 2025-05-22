import * as Plot from '@observablehq/plot';
import { Trans, useLingui } from '@lingui/react/macro';

import PlotFigure from './PlotFigure';

export function Timeline({ data }) {
  const { i18n } = useLingui();
  return (
    <article>
      <h2>
        <Trans>Timeline</Trans>
      </h2>
      <p>
        <PlotFigure
          width={600}
          options={{
            width: 600,
            figure: true,
            color: { scheme: 'YlGn' },
            style: {
              fontFamily: 'Inter',
              fontSize: 'var(--step--1)',
            },

            x: {
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
            /*
        y: { tickFormat: null, tickSize: 0 },
        fy: { reverse: true },
        marginLeft: 0,
        marginRight: 80,
        marginBottom: 80,
        marks: [
          Plot.cell(data, {
            x: (d) => Math.floor((d.week - 1) / 4),
            y: (d) => (d.week - 1) % 4,
            fy: 'year',
            fill: 'totalNumberDifficulty',
            title: (d) =>
              `Week ${d.week}: ${Object.entries(
                d.difficulty.reduce((acc, grade) => {
                  if (!acc[grade]) {
                    acc[grade] = 0;
                  }
                  acc[grade] += 1;
                  return acc;
                }, {}),
              )
                .toSorted((a, b) => a[0].localeCompare(b[0]))
                .reduce(
                  (acc, ascents) => [...acc, `${ascents[0]} x${ascents[1]}`],
                  [] as string[],
                )
                .join('; ')}`,
            inset: 1,
          }),
        ],
        */

            marginBottom: 50,
            marks: [
              Plot.barX(data, {
                interval: 'week',
                x: 'date',
                fill: 'totalNumberDifficulty',
                title: (d) =>
                  Object.entries(
                    d.difficulty.reduce((acc, grade) => {
                      if (!acc[grade]) {
                        acc[grade] = 0;
                      }
                      acc[grade] += 1;
                      return acc;
                    }, {}),
                  )
                    .toSorted((a, b) => a[0].localeCompare(b[0]))
                    .reduce(
                      (acc, ascents) => [
                        ...acc,
                        `${ascents[0]} x${ascents[1]}`,
                      ],
                      [] as string[],
                    )
                    .join('; '),
              }),
            ],
          }}
        />
      </p>
    </article>
  );
}
