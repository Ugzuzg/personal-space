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
        <div className="wrapper">
          <div className="master-grid flow prose">
            <MDXContent code={entry.mdx} />
          </div>
        </div>
      </div>
    </article>
  );
}
