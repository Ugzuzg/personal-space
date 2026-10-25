import contentCollections from '@content-collections/vite';
import { lingui, linguiTransformerBabelPreset } from '@lingui/vite-plugin';
import babel from '@rolldown/plugin-babel';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

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
    imagetools(),
    contentCollections(),
    tanstackStart({
      prerender: {
        enabled: process.env.PRERENDER === 'true',
        crawlLinks: true,
        failOnError: false,
      },
      pages: [{ path: '/en' }, { path: '/en/climbing/56689' }],
      sitemap: {
        host: 'https://me.jaryk.xyz',
      },
    }),
    viteReact(),
    lingui(),
    // Lingui macroTransform doesn't work with tanstack, so babel is still needed.
    babel({ presets: [linguiTransformerBabelPreset()] }),
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
  ],
});
