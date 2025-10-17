export const languages = ['en', 'be', 'sv'] as const;

export const languageToLocale: Record<(typeof languages)[number], string> = {
  en: 'en-GB',
  be: 'be-BY',
  sv: 'sv-SE',
};
