import * as Plot from '@observablehq/plot';
import PlotFigure from './PlotFigure';

export function Completion({ data }) {
  const allSent = data.map((v) => v.sent).reduce((a, b) => a + b, 0);
  const allBoulders = data.map((v) => v.all).reduce((a, b) => a + b, 0);

  return (
    <>
      {`${allSent} / ${allBoulders} (${Number(allSent / allBoulders).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })})`}
      <PlotFigure
        width={400}
        options={{
          figure: true,
          grid: true,
          width: 400,
          marginLeft: 80,
          marginBottom: 50,
          x: {
            percent: true,
          },
          color: { scheme: 'YlGn' },
          style: {
            fontFamily: 'Inter',
            fontSize: 'var(--step--1)',
          },
          marks: [
            Plot.frame(),
            Plot.barX(data, {
              y: 'difficulty',
              x: 'completion',
              title: (v) =>
                `${v.sent} / ${v.all} (${Number(v.completion).toLocaleString(undefined, { style: 'percent' })})`,
              fill: 'completion',
            }),
          ],
          y: { type: 'band', reverse: true },
        }}
      />
    </>
  );
}
