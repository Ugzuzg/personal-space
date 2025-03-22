import * as Plot from '@observablehq/plot';
import PlotFigure from './PlotFigure';

export function Timeline({ data }) {
  return (
    <PlotFigure
      options={{
        /*
        figure: true,
        x: { tickFormat: (d) => `Week ${d + 1}`, tickRotate: 90 },
        y: { tickFormat: '', tickSize: 0 },
        color: { scheme: 'YlGn', domain: [0, 3000] },
        marginBottom: 50,
        marks: [
          Plot.cell(data, {
            x: (d) =>
              d3.utcWeek.count(d3.utcYear(new Date(d.date)), new Date(d.date)),
            y: (d) => new Date(d.date).getUTCFullYear(),
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
            inset: 1,
          }),
        ],
        */
        figure: true,
        color: { scheme: 'YlGn' },
        style: {
          fontFamily: 'Inter',
          fontSize: 'var(--step--1)',
        },
        width: 1500,
        marginLeft: 80,
        marginRight: 100,
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
