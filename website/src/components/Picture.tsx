export function Picture({
  pic,
  alt,
  className,
  sizes = '100vw',
}: {
  pic: {
    sources: Record<string, string>;
    img: { src: string; w: number; h: number };
  };
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <picture className={className}>
      {Object.entries(pic.sources).map(([fmt, srcset]) => (
        <source key={fmt} type={`image/${fmt}`} srcSet={srcset} sizes={sizes} />
      ))}
      <img src={pic.img.src} width={pic.img.w} height={pic.img.h} alt={alt} loading="lazy" />
    </picture>
  );
}
