import Head from 'next/head';

export const SITE_URL = 'https://morse-code.busanito.workers.dev';
export const SITE_NAME = 'Morse Code Converter';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export default function Seo({ title, description, path = '/' }) {
  const url = `${SITE_URL}${path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0a0e14" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
    </Head>
  );
}
