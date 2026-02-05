import { createServerFn } from '@tanstack/react-start';

import { readTheSheetServer } from './readTheSheet.server';

export const readTheSheet = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await readTheSheetServer();
  },
);
