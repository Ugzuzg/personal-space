import { createFileRoute, Link } from '@tanstack/react-router';
import { allEntries } from 'content-collections';
import styles from './journal.index.module.css';
import { Trans } from '@lingui/react/macro';

export const Route = createFileRoute('/$lang/journal/')({
  loader: ({ params }) => {
    return allEntries
      .filter((entry) => entry._meta.directory === params.lang)
      .toSorted(
        (a, b) =>
          new Date(b.published).getTime() - new Date(a.published).getTime(),
      );
  },
  component: JournalIndex,
});

function JournalIndex() {
  const sortedEntries = Route.useLoaderData();

  return (
    <div className={styles['journal-index']}>
      <h1>
        <Trans>Journal</Trans>
      </h1>
      <ol role="list" reversed>
        {sortedEntries.map((entry) => (
          <li key={entry._meta.fileName}>
            <Link
              to="/$lang/journal/$slug"
              params={{
                lang: entry._meta.directory,
                slug: entry._meta.fileName.replace(/\.mdx$/, ''),
              }}
            >
              <h2 className={styles['entry-heading']}>{entry.title}</h2>
            </Link>
            {entry.description && <p>{entry.description}</p>}
            <time dateTime={entry.published}>{entry.published}</time>
          </li>
        ))}
      </ol>
    </div>
  );
}
