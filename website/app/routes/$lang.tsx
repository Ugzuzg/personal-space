import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router';
import { setI18n } from '@lingui/react/server';
import { Trans } from '@lingui/react/macro';

import { getI18nInstance } from '~/localething';
import { LinguiClientProvider } from '~/components/LinguiClientProvider';

export const Route = createFileRoute('/$lang')({
  component: Home,
});

export function Home() {
  const { lang } = Route.useParams();

  const i18n = getI18nInstance(lang); // get a ready-made i18n instance for the given locale
  setI18n(i18n);

  return (
    <LinguiClientProvider locale={lang} initialMessages={i18n.messages}>
      <nav>
        <Link
          to="/$lang"
          params={{ lang }}
          activeProps={{ className: 'font-bold' }}
          activeOptions={{ exact: true }}
        >
          <Trans>Home</Trans>
        </Link>{' '}
        <Link
          to="/$lang/climbing"
          params={{ lang }}
          activeProps={{ className: 'font-bold' }}
        >
          <Trans>Climbing</Trans>
        </Link>
        <ul>
          <li>
            <Link to="." params={{ lang: 'en' }}>
              🌐English
            </Link>
          </li>
          <li>
            <Link to="." params={{ lang: 'be' }}>
              🌐Беларуская
            </Link>
          </li>
        </ul>
        <hr />
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <hr />
        <a href="https://github.com/Ugzuzg/personal-space" target="_blank">
          Source
        </a>
        <ul>
          <li>
            <Link to="." params={{ lang: 'en' }}>
              English
            </Link>
          </li>
          <li>
            <Link to="." params={{ lang: 'be' }}>
              Беларуская
            </Link>
          </li>
        </ul>
      </footer>
    </LinguiClientProvider>
  );
}
