import { createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import sheets from '@googleapis/sheets';
import { createServerFn } from '@tanstack/react-start';
import { useLingui } from '@lingui/react';
import { languageToLocale } from 'locales';

function optional<A, T>(fn: (a: A) => T): (a: A) => T | null {
  return (a: A | null | undefined) => {
    if (!a) return null;
    return fn(a);
  };
}
const excelDateToJsDate = (date: number): Date => {
  return new Date((date - 25569) * 86400 * 1000);
};

const readTheSheet = createServerFn({ method: 'GET' }).handler(async () => {
  const googleAuth = new sheets.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const client = sheets.sheets({ version: 'v4', auth: googleAuth });
  const sheetsValues = await client.spreadsheets.values.batchGet({
    spreadsheetId: '1zE6HX-JQ6jF729X_WHkya4bt8PYpD5shgcjm48u-7kg',
    ranges: [
      // To send?
      'All Shoes!E:E',
      // Collected?
      'All Shoes!F:F',
      // Total weight to ship
      'All Shoes!N4',
      // Estimated shipping cost
      'All Shoes!N5',
      // Shipped there on
      'All Shoes!N8',
      // Shipped back on
      'All Shoes!N9',
    ],
    valueRenderOption: 'UNFORMATTED_VALUE',
  });
  return {
    shoesToSend:
      sheetsValues.data.valueRanges?.[0].values
        ?.flat()
        .filter((v) => v === true).length ?? 0,
    shoesCollected:
      sheetsValues.data.valueRanges?.[1]?.values
        ?.flat()
        .filter((v) => v === true).length ?? 0,
    totalWeight:
      (sheetsValues.data.valueRanges?.[2].values?.[0]?.[0] as number) ?? 0,
    estimatedShippingCost:
      (sheetsValues.data.valueRanges?.[3].values?.[0]?.[0] as number) ?? 0,
    shippedThereOn: optional(excelDateToJsDate)(
      sheetsValues.data.valueRanges?.[4].values?.[0]?.[0],
    ),
    shippedBackOn: optional(excelDateToJsDate)(
      sheetsValues.data.valueRanges?.[5].values?.[0]?.[0],
    ),
  };
});

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
