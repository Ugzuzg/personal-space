'use client';

import { I18nProvider } from '@lingui/react';
import { type Messages, setupI18n } from '@lingui/core';
import { useEffect, useState } from 'react';
import { allMessages } from '../localething';

export function LinguiClientProvider({
  children,
  locale,
  initialMessages,
}: {
  children: React.ReactNode;
  locale: string;
  initialMessages: Messages;
}) {
  const [i18n] = useState(() => {
    return setupI18n({
      locale: locale,
      messages: { [locale]: initialMessages },
    });
  });

  useEffect(() => {
    i18n.load(locale, allMessages[locale]);
    i18n.activate(locale);
  }, [i18n, locale]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
