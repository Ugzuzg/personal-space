import { defineConfig } from '@lingui/cli';

import { languages } from './locales';

export default defineConfig({
  sourceLocale: 'en',
  locales: languages as unknown as string[],
  catalogs: [
    {
      path: '<rootDir>/app/locales/{locale}',
      include: ['app'],
    },
  ],
});
