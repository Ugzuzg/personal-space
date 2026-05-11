import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react-swc';
import { lingui } from '@lingui/vite-plugin';
import { nitro } from 'nitro/vite';
import contentCollections from '@content-collections/vite';

export default defineConfig({
  preview: { host: '127.0.0.1' },
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
    external: ['nodejs-polars'],
  },
  optimizeDeps: { exclude: ['nodejs-polars'] },
  plugins: [
    contentCollections(),
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
    process.env.PRERENDER === 'true'
      ? null
      : nitro({
          publicAssets: [
            // this is a temporary fix to https://github.com/TanStack/router/issues/5368
            {
              maxAge: 60_000,
              dir: 'dist/client/__tsr',
              baseURL: '/__tsr',
            },
          ],
        }),
    viteReact({
      plugins: [['@lingui/swc-plugin', {}]],
    }),
  ],
});
