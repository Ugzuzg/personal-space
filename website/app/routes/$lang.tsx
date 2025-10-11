import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
} from '@tanstack/react-router';
import { setI18n } from '@lingui/react/server';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { defineMessage, plural } from '@lingui/core/macro';

import { getI18nInstance } from '~/catalogs';
import { LinguiClientProvider } from '~/components/LinguiClientProvider';

import en from '~/img/en-gpt.png?url';
import be from '~/img/be-gpt.png?url';
import sv from '~/img/sv-gpt.png?url';

import { languages, languageToLocale } from '../../locales';

export const Route = createFileRoute('/$lang')({
  head: (ctx) => ({
    meta: [{ name: 'og:locale', content: languageToLocale[ctx.params.lang] }],
  }),
  component: Home,
  loader: (options) => {
    if (!languages.includes(options.params.lang as any)) {
      throw notFound();
    }
  },
});

function LanguageIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      style={{ marginRight: '4px', width: '1.2em', height: '1.2em' }}
    >
      <title>language</title>
      <g fill="currentColor">
        <path d="M20 18h-1.44a.6.6 0 0 1-.4-.12.8.8 0 0 1-.23-.31L17 15h-5l-1 2.54a.8.8 0 0 1-.22.3.6.6 0 0 1-.4.14H9l4.55-11.47h1.89zm-3.53-4.31L14.89 9.5a12 12 0 0 1-.39-1.24q-.09.37-.19.69l-.19.56-1.58 4.19zm-6.3-1.58a13.4 13.4 0 0 1-2.91-1.41 11.46 11.46 0 0 0 2.81-5.37H12V4H7.31a4 4 0 0 0-.2-.56C6.87 2.79 6.6 2 6.6 2l-1.47.5s.4.89.6 1.5H0v1.33h2.15A11.23 11.23 0 0 0 5 10.7a17.2 17.2 0 0 1-5 2.1q.56.82.87 1.38a23.3 23.3 0 0 0 5.22-2.51 15.6 15.6 0 0 0 3.56 1.77zM3.63 5.33h4.91a8.1 8.1 0 0 1-2.45 4.45 9.1 9.1 0 0 1-2.46-4.45" />
      </g>
    </svg>
  );
}

function LanguagePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useLingui();

  return (
    <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
      <summary style={{ display: 'inline-flex', alignItems: 'center' }}>
        <LanguageIcon />
        {i18n._(
          defineMessage({
            message: plural(languages.length, {
              one: '# lanaguage',
              other: '# languages',
            }),
          }),
        )}
      </summary>
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
            style={{ display: 'inline-flex', alignItems: 'center' }}
            onClick={() => setIsOpen(false)}
          >
            <img src={en} style={{ height: '4em', width: 'auto' }} />
            <span lang="en">English</span>
          </Link>
        </li>
        <li>
          <Link
            to="."
            params={{ lang: 'be' }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
            onClick={() => setIsOpen(false)}
          >
            <img src={be} style={{ height: '4em', width: 'auto' }} />
            <span lang="be">Беларуская</span>
          </Link>
        </li>
        <li>
          <Link
            to="."
            params={{ lang: 'sv' }}
            style={{ display: 'inline-flex', alignItems: 'center' }}
            onClick={() => setIsOpen(false)}
          >
            <img src={sv} style={{ height: '4em', width: 'auto' }} />
            <span lang="sv">Svenska</span>
          </Link>
        </li>
      </ul>
    </details>
  );
}

export function Home() {
  const { lang } = Route.useParams();

  const i18n = getI18nInstance(lang as (typeof languages)[number]);
  setI18n(i18n);

  return (
    <LinguiClientProvider locale={lang} initialMessages={i18n.messages}>
      <div lang={lang}>
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
            <li>
              <Link
                to="/$lang/resoling"
                params={{ lang }}
                activeProps={{ className: 'font-bold' }}
              >
                <Trans>Are we resoling yet?</Trans>
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
      </div>
    </LinguiClientProvider>
  );
}
