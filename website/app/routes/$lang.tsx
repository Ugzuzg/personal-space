import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
} from '@tanstack/react-router';
import { setI18n } from '@lingui/react/server';
import { Trans } from '@lingui/react/macro';

import { getI18nInstance } from '~/localething';
import { LinguiClientProvider } from '~/components/LinguiClientProvider';

import en from '~/img/en-gpt.png?url';
import be from '~/img/be-gpt.png?url';
import { useState } from 'react';

export const Route = createFileRoute('/$lang')({
  component: Home,
  loader: (options) => {
    if (!['en', 'be'].includes(options.params.lang)) {
      throw notFound();
    }
  },
});

function LanguagePicker() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
      <summary>🌐</summary>
      <ul
        style={{
          position: 'absolute',
          right: 0,
          listStyleType: 'none',
          padding: 0,
          background: 'var(--color-background)',
        }}
      >
        <li>
          <Link
            to="."
            params={{ lang: 'en' }}
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => setIsOpen(false)}
          >
            <img src={en} style={{ height: '4em', width: 'auto' }} />
            English
          </Link>
        </li>
        <li>
          <Link
            to="."
            params={{ lang: 'be' }}
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => setIsOpen(false)}
          >
            <img src={be} style={{ height: '4em', width: 'auto' }} />
            Беларуская
          </Link>
        </li>
      </ul>
    </details>
  );
}

export function Home() {
  const { lang } = Route.useParams();

  const i18n = getI18nInstance(lang); // get a ready-made i18n instance for the given locale
  setI18n(i18n);

  return (
    <LinguiClientProvider locale={lang} initialMessages={i18n.messages}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <ul
          style={{
            display: 'flex',
            margin: 0,
            padding: 0,
            listStyleType: 'none',
            gap: '8px',
          }}
        >
          <li>
            <Link
              to="/$lang"
              params={{ lang }}
              activeProps={{ className: 'font-bold' }}
              activeOptions={{ exact: true }}
            >
              <Trans>Home</Trans>
            </Link>
          </li>
          <li>
            <Link
              to="/$lang/climbing"
              params={{ lang }}
              activeProps={{ className: 'font-bold' }}
            >
              <Trans>Climbing</Trans>
            </Link>
          </li>
        </ul>
        <LanguagePicker />
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
      <footer>
        <hr />
        <a href="https://github.com/Ugzuzg/personal-space" target="_blank">
          <Trans>Source</Trans>
        </a>
      </footer>
    </LinguiClientProvider>
  );
}
