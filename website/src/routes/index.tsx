import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

export const navigateToLang = createServerFn({}).handler(async () => {
  const request = getRequest();
  const acceptLanguage = request?.headers.get('accept-language') ?? 'en';
  if (acceptLanguage.includes('be') || acceptLanguage.includes('ru')) {
    throw redirect({ to: '/$lang', params: { lang: 'be' } });
  }
  if (acceptLanguage.includes('sv')) {
    throw redirect({ to: '/$lang', params: { lang: 'sv' } });
  }
  throw redirect({ to: '/$lang', params: { lang: 'en' } });
});

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    await navigateToLang();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <></>;
}
