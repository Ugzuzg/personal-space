import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import viteReact from '@vitejs/plugin-react';
import { lingui } from '@lingui/vite-plugin';
import { nitro } from 'nitro/vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    external: ['nodejs-polars'],
  },
  optimizeDeps: { exclude: ['nodejs-polars'] },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    lingui(),
    tanstackStart({
      prerender: {
        enabled: process.env.PRERENDER === 'true',
        crawlLinks: true,
        failOnError: true,
      },
      pages: [{ path: '/en' }, { path: '/en/climbing/56689' }],
      sitemap: {
        host: 'https://me.jaryk.xyz',
      },
    }),
    viteReact({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    nitro({
      publicAssets: [
        // this is a temporary fix to https://github.com/TanStack/router/issues/5368
        {
          maxAge: 60_000,
          dir: 'dist/client/__tsr',
          baseURL: '/__tsr',
        },
      ],
    }),
  ],
});
