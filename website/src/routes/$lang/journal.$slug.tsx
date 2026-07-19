import { createFileRoute, notFound } from '@tanstack/react-router';
import { allEntries } from 'content-collections';
import { MDXContent } from '@content-collections/mdx/react';

export const Route = createFileRoute('/$lang/journal/$slug')({
  loader: ({ params }) => {
    const entry = allEntries.find(
      (e) =>
        e._meta.directory === params.lang &&
        e._meta.fileName === `${params.slug}.mdx`,
    );
    if (!entry) {
      throw notFound();
    }
    return entry;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    return {
      meta: [
        { title: `${loaderData.title} - Jaryk's personal space` },
        { name: 'description', content: loaderData.description },

        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: loaderData.description },
        { property: 'og:image', content: loaderData.coverImage },
        { property: 'og:type', content: 'article' },
      ],
      links: [
        loaderData.atUri && {
          rel: 'site.standard.document',
          href: loaderData.atUri,
        },
        {
          rel: 'site.standard.publication',
          href: 'at://did:plc:ocxjv5zgpagjilxs5vz2fulm/site.standard.publication/3mqwbv3tij22u',
        },
      ].filter(Boolean),
    };
  },
  component: JournalEntry,
});

function JournalEntry() {
  const entry = Route.useLoaderData();

  return (
    <article>
      <header>
        <h1>{entry.title}</h1>
        <time dateTime={entry.published}>{entry.published}</time>
      </header>
      <div className="article">
        <div className="master-grid flow prose">
          <MDXContent code={entry.mdx} />
        </div>
      </div>
    </article>
  );
}
