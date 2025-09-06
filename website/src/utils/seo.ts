export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'og:type', content: 'website' },
    { name: 'og:title', content: title },
    ...['en_GB', 'be_BY', 'sv_SE'].map((locale) => ({
      name: 'og:locale:alternate',
      content: locale,
    })),
    { name: 'og:description', content: description },
    ...(image ? [{ name: 'og:image', content: image }] : []),
  ];

  return tags;
};
