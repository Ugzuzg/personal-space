import sheets from '@googleapis/sheets';

function optional<A, T>(fn: (a: A) => T): (a: A) => T | null {
  return (a: A | null | undefined) => {
    if (!a) return null;
    return fn(a);
  };
}
const excelDateToJsDate = (date: number): Date => {
  return new Date((date - 25569) * 86400 * 1000);
};

export async function readTheSheetServer() {
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
}
