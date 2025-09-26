import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import viteReact from '@vitejs/plugin-react';
import { lingui } from '@lingui/vite-plugin';

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: { exclude: ['nodejs-polars'] },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    lingui(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      pages: [{ path: '/en' }, { path: '/en/climbing/56689' }],
    }),
    viteReact({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
  ],
});
