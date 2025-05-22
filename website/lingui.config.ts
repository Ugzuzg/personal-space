import { defineConfig } from '@lingui/cli';

import { locales } from './locales';

export default defineConfig({
  sourceLocale: 'en',
  locales: locales as unknown as string[],
  catalogs: [
    {
      path: '<rootDir>/app/locales/{locale}',
      include: ['app'],
    },
  ],
});
