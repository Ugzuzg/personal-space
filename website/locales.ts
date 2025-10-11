export const languages = ['en', 'be', 'sv'] as const;

export const languageToLocale: Record<(typeof languages)[number], string> = {
  en: 'en_GB',
  be: 'be_BY',
  sv: 'sv_SE',
};
