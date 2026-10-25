import js from '@eslint/js';
import { defineConfig as defineEslintConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export function defineConfig({ tsconfigRootDir }: { tsconfigRootDir: string }) {
  return defineEslintConfig([
    globalIgnores(['dist/']),
    {
      files: ['**/*.js'],
      extends: [js.configs.recommended],
    },
    {
      files: ['**/*.ts'],
      extends: [js.configs.recommended, tseslint.configs.strictTypeChecked],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      rules: {
        '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      },
    },
  ]);
}
