import { useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react/macro';

import PlotFigure from './PlotFigure';

export function Completion({ data }) {
  const { i18n, t } = useLingui();
  const allSent = data.map((v) => v.sent).reduce((a, b) => a + b, 0);
  const allBoulders = data.map((v) => v.all).reduce((a, b) => a + b, 0);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.locale, {
        style: 'decimal',
        maximumFractionDigits: 0,
      }),
    [i18n.locale],
  );
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.locale, {
        style: 'percent',
        minimumFractionDigits: 2,
      }),
    [i18n.locale],
  );

  return (
    <article>
      <h2>
        <Trans>Boulder progress at Klättercentret Solna</Trans>
      </h2>
      <p>
        <Trans>
          Overall progress: {numberFormatter.format(allSent)} /{' '}
          {numberFormatter.format(allBoulders)} (
          {percentFormatter.format(allSent / allBoulders)})
        </Trans>
      </p>
      <p>
        <PlotFigure
          width={400}
          options={{
            figure: true,
            grid: true,
            width: 400,
            marginLeft: 80,
            marginBottom: 50,
            color: { scheme: 'YlGn' },
            style: {
              fontFamily: 'Inter',
              fontSize: 'var(--size-step--1)',
            },
            marks: [
              Plot.barX(data, {
                y: 'difficulty',
                x: 'all',
                title: (v) =>
                  `${v.sent} / ${v.all} (${Number(v.completion).toLocaleString(undefined, { style: 'percent' })})`,
                fill: 'rgba(169, 169, 169, 0.5)',
              }),
              Plot.barX(data, {
                y: 'difficulty',
                x: 'sent',
                title: (v) =>
                  `${v.sent} / ${v.all} (${Number(v.completion).toLocaleString(undefined, { style: 'percent' })})`,
                fill: 1,
              }),
              Plot.frame(),
            ],
            y: {
              label: t`difficulty`,
              type: 'band',
              reverse: true,
            },
          }}
        />
      </p>
    </article>
  );
}
