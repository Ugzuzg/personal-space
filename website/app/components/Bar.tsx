import * as Plot from '@observablehq/plot';
import { useLingui } from '@lingui/react/macro';

import PlotFigure from './PlotFigure';

export function Bar({ data }) {
  const { i18n, t } = useLingui();

  const ascentTypeColorDomain = {
    domain: ['flash', 'redpoint'],
    range: ['#ffd800', '#ff5151'],
  };
  let groupings = [
    {
      name: t`All time`,
      fill: 'type',
    },
    {
      name: t`By year`,
      fy: 'year',
      fill: 'type',
      label: t`year`,
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
                x: {
                  label: t`count`,
                },
                y: {
                  label: t`difficulty`,
                  type: 'band',
                  reverse: true,
                },
                ...(grouping.fy && {
                  fy: {
                    label: grouping.label,
                    reverse: true,
                    tickFormat: (v) => {
                      return i18n.date(new Date(Date.UTC(v)), {
                        year: 'numeric',
                      });
                    },
                  },
                }),
                style: {
                  fontFamily: 'Inter',
                  fontSize: 'var(--step--1)',
                },
                marginLeft: 80,
                marginRight: 80,
                marginBottom: 50,
                marks: [
                  Plot.barX(
                    data,
                    Plot.groupY(
                      { x: 'count' },
                      { ...grouping, y: 'difficulty', title: 'type' },
                    ),
                  ),
                  Plot.frame(),
                ],
              }}
            />
          </p>
        </section>
      ))}
    </article>
  );
}
