import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { setI18n } from '@lingui/react/server';
import { Trans } from '@lingui/react/macro';

import { getI18nInstance } from '~/localething';
import { LinguiClientProvider } from '~/components/LinguiClientProvider';

import en from '~/img/en-gpt.png?url';
import be from '~/img/be-gpt.png?url';

export const Route = createFileRoute('/$lang')({
  component: Home,
});

function LanguagePicker() {
  return (
    <details>
      <summary>🌐</summary>
      <ul
        style={{
          position: 'absolute',
          right: 0,
          listStyleType: 'none',
          padding: 0,
        }}
      >
        <li>
          <Link
            to="."
            params={{ lang: 'en' }}
            style={{ display: 'flex', alignItems: 'center' }}
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
          Source
        </a>
      </footer>
    </LinguiClientProvider>
  );
}
