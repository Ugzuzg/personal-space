import { defineConfig } from '@lingui/cli';

import { languages } from './src/locales';

export default defineConfig({
  sourceLocale: 'en',
  fallbackLocales: {
    en: 'en-GB',
  },
  locales: languages as unknown as string[],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
});
