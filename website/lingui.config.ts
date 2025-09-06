import { defineConfig } from '@lingui/cli';

import { locales } from './locales';

export default defineConfig({
  sourceLocale: 'en',
  locales: locales as unknown as string[],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
});
