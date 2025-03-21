import * as Plot from '@observablehq/plot';
import PlotFigure from './PlotFigure';

export function Timeline({ data }) {
  return (
    <PlotFigure
      options={{
        figure: true,
        color: { scheme: 'YlGn' },
        style: {
          fontFamily: 'Inter',
        },
        width: 1500,
        marginLeft: 100,
        marginRight: 100,
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
