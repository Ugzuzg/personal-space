import * as Plot from '@observablehq/plot';
import PlotFigure from './PlotFigure';

export function Bar({ data }) {
  const ascentTypeColorDomain = {
    domain: ['flash', 'redpoint'],
    range: ['#ffd800', '#ff5151'],
  };
  let groupings = [
    {
      name: 'All time',
      y: 'difficulty',
      fill: 'type',
    },
    {
      name: 'By year',
      y: 'difficulty',
      fy: 'year',
      fill: 'type',
    },
    /*
    {
      name: 'By gym',
      y: 'difficulty',
      fx: 'year',
      fy: 'parent_name',
      fill: 'type',
    },
    {
      name: 'By route setter',
      y: 'difficulty',
      fx: 'year',
      fy: 'route_setter',
      fill: 'type',
      sort: { fy: '-x', reduce: 'count' },
    },
    */
  ];

  return (
    <article>
      <h2>Bar</h2>
      {groupings.map((grouping) => (
        <section>
          <h3>{grouping.name}</h3>
          <p>
            <PlotFigure
              width={480}
              options={{
                figure: true,
                grid: true,
                color: {
                  legend: true,
                  type: 'categorical',
                  ...ascentTypeColorDomain,
                },
                width: 480,
                y: { type: 'band', reverse: true },
                ...(grouping.fy && {
                  fy: { reverse: true },
                }),
                style: {
                  fontFamily: 'Inter',
                  fontSize: 'var(--step--1)',
                },
                marginLeft: 80,
                marginRight: 80,
                marginBottom: 50,
                marks: [
                  Plot.frame(),
                  Plot.barX(
                    data,
                    Plot.groupY({ x: 'count' }, { ...grouping, title: 'type' }),
                  ),
                ],
              }}
            />
          </p>
        </section>
      ))}
    </article>
  );
}
