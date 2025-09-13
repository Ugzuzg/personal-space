import { createFileRoute } from '@tanstack/react-router';
import { Trans } from '@lingui/react/macro';
import sheets from '@googleapis/sheets';
import { createServerFn } from '@tanstack/react-start';
import { useLingui } from '@lingui/react';

const readTheSheet = createServerFn({ type: 'dynamic' }).handler(async () => {
  const googleAuth = new sheets.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const client = sheets.sheets({ version: 'v4', auth: googleAuth });
  const a = await client.spreadsheets.values.batchGet({
    spreadsheetId: '1zE6HX-JQ6jF729X_WHkya4bt8PYpD5shgcjm48u-7kg',
    ranges: [
      // To send?
      'All Shoes!E:E',
      // Total weight to ship
      'All Shoes!N4',
      // Estimated shipping cost
      'All Shoes!N5',
    ],
    valueRenderOption: 'UNFORMATTED_VALUE',
  });
  return {
    shoesToSend:
      a.data.valueRanges?.[0].values?.flat().filter((v) => v === true).length ??
      0,
    totalWeight: (a.data.valueRanges?.[1].values?.[0]?.[0] as number) ?? 0,
    estimatedShippingCost:
      (a.data.valueRanges?.[2].values?.[0]?.[0] as number) ?? 0,
  };
});

export const Route = createFileRoute('/$lang/resoling')({
  loader: async () => await readTheSheet(),
  component: RouteComponent,
});

function RouteComponent() {
  const { shoesToSend, ...data } = Route.useLoaderData();
  const { i18n } = useLingui();

  // lingui doesn't support skeletons in ICU messages yet, preformat the numbers manually
  const totalWeight = data.totalWeight.toLocaleString(i18n.locale, {
    style: 'unit',
    unit: 'gram',
  });
  const estimatedShippingCost = data.estimatedShippingCost.toLocaleString(
    i18n.locale,
    { style: 'currency', currency: 'SEK' },
  );
  const costPerPair = (data.estimatedShippingCost / shoesToSend).toLocaleString(
    i18n.locale,
    { style: 'currency', currency: 'SEK' },
  );

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
    </section>
  );
}
