import * as Plot from '@observablehq/plot';
import PlotFigure from './PlotFigure';

export function Bar({ data }) {
  const ascentTypeColorDomain = {
    domain: ['flash', 'redpoint'],
    range: ['#ffd800', '#ff5151'],
  };
  let groupings = [
    {
      name: 'Everything',
      y: 'difficulty',
      fill: 'type',
    },
    {
      name: 'By year',
      y: 'difficulty',
      fy: 'year',
      fill: 'type',
    },
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
  ];

  return (
    <>
      {groupings.map((grouping) => (
        <>
          <h3>{grouping.name}</h3>
          <PlotFigure
            options={{
              figure: true,
              grid: true,
              color: {
                legend: true,
                type: 'categorical',
                ...ascentTypeColorDomain,
              },
              width: 1500,
              y: { type: 'band', reverse: true },
              style: {
                fontFamily: 'Inter',
              },
              marginLeft: 100,
              marginRight: 100,
              marks: [
                Plot.frame(),
                Plot.barX(
                  data,
                  Plot.groupY({ x: 'count' }, { ...grouping, title: 'count' }),
                ),
              ],
            }}
          />
        </>
      ))}
    </>
  );
}
