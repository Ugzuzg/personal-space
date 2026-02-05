import { createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react';
import { languageToLocale } from 'locales';
import { readTheSheet } from '~/utils/readTheSheet.functions';

export const Route = createFileRoute('/$lang/resoling')({
  loader: async () => await readTheSheet(),
  component: RouteComponent,
});

function RouteComponent() {
  const { shoesToSend, shoesCollected, ...data } = Route.useLoaderData();
  const { i18n } = useLingui();
  const locale = languageToLocale[i18n.locale] ?? i18n.locale;

  // lingui doesn't support skeletons in ICU messages yet, preformat the numbers manually
  const totalWeight = data.totalWeight.toLocaleString(locale, {
    style: 'unit',
    unit: 'gram',
  });
  const estimatedShippingCost = data.estimatedShippingCost.toLocaleString(
    locale,
    { style: 'currency', currency: 'SEK' },
  );
  const costPerPair = (data.estimatedShippingCost / shoesToSend).toLocaleString(
    locale,
    { style: 'currency', currency: 'SEK' },
  );

  const allCollected = shoesCollected >= shoesToSend;

  return (
    <section>
      <h1>
        <Trans>Are we resoling yet?</Trans>
      </h1>
      <p>
        <Trans>
          We have {shoesToSend} pairs of shoes to send, with a total weight of{' '}
          {totalWeight} and an estimated shipping cost of{' '}
          {estimatedShippingCost}, which averages to {costPerPair} per pair one
          way.
        </Trans>
      </p>
      <p>
        <label>
          <Trans>
            Shoes collected:{' '}
            <progress max={shoesToSend} value={shoesCollected}>
              {shoesCollected} / {shoesToSend}
            </progress>
          </Trans>
        </label>
      </p>
      {allCollected && !data.shippedThereOn && (
        <p>
          <Trans>Awaiting to be shipped.</Trans>
        </p>
      )}
      {data.shippedThereOn && (
        <p>
          <Trans>
            Shipped there on {data.shippedThereOn.toLocaleDateString(locale)}
          </Trans>
        </p>
      )}
      {data.shippedBackOn && (
        <p>
          <Trans>
            Shipped back on {data.shippedBackOn.toLocaleDateString(locale)}
          </Trans>
        </p>
      )}
    </section>
  );
}
