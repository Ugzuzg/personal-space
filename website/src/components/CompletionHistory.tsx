import * as Plot from '@observablehq/plot';
import { Trans } from '@lingui/react/macro';
import PlotFigure from './PlotFigure';

export function CompletionHistory({ data }) {
  return (
    <article>
      <h2>
        <Trans>Solna completion history</Trans>
      </h2>
      <p>
        <PlotFigure
          width={1200}
          options={{
            figure: true,
            grid: true,
            width: 1200,
            marginLeft: 80,
            marginRight: 100,
            marginBottom: 50,
            style: {
              fontFamily: 'Inter',
              fontSize: 'var(--step--1)',
            },
            marks: [
              Plot.ruleY([0, 140]),
              Plot.lineY(data, {
                x: 'date',
                y: 'sentToTheDay',
                stroke: '#ffd800',
              }),
              Plot.lineY(data, {
                x: 'date',
                y: 'totalOnTheDay',
                stroke: '#ff5151',
              }),
              Plot.frame(),
            ],
          }}
        />
      </p>
    </article>
  );
}
