import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';

const entries = defineCollection({
  name: 'entries',
  directory: './src/journal',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    published: z.iso.date(),
    description: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  content: [entries],
});
