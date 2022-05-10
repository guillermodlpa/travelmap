import Head from 'next/head';
import { useTheme } from 'styled-components';

const META_DESCRIPTION =
  'A map of the countries you have visited. Sign up, create your map, and combine it with the maps of your friends.';

export default function HeadWithDefaults({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <Head>
      {title && <title>{title}</title>}
      <meta name="description" content={META_DESCRIPTION} />
      <meta name="author" content="Guillermo de la Puente" />
      <meta
        name="theme-color"
        content={
          theme.dark ? theme.global.colors.parchment.dark : theme.global.colors.parchment.light
        }
      ></meta>
      <meta
        property="og:image"
        content="https://travelmap.guillermodlpa.com/landing-page-screenshot.png"
      />
      <meta property="og:title" content={title} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
    </Head>
  );
}
