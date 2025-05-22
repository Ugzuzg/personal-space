import { defineConfig } from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import { lingui } from '@lingui/vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  routers: {
    server: {
      vite: {
        plugins: [
          react({
            babel: {
              plugins: ['@lingui/babel-plugin-lingui-macro'],
            },
          }),
        ],
      },
    },
  },
  server: {
    esbuild: {
      options: { target: 'es2022' },
    },
    prerender: {
      routes: ['/', '/en', '/be'],
      crawlLinks: true,
    },
  },
  react: {
    babel: {
      plugins: ['@lingui/babel-plugin-lingui-macro'],
    },
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      lingui(),
    ],
  },
});
