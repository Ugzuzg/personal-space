import * as Plot from '@observablehq/plot';
import PlotFigure from './PlotFigure';
import * as d3 from 'd3';

export function Timeline({ data }) {
  return (
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

        /*
        x: {
          tickFormat: (d) =>
            Intl.DateTimeFormat('en', { month: 'long' }).format(
              new Date(String(d)),
            ),
          tickRotate: 45,
        },
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
                  (acc, ascents) => [...acc, `${ascents[0]} x${ascents[1]}`],
                  [] as string[],
                )
                .join('; '),
          }),
        ],
      }}
    />
  );
}
