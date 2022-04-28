import Head from 'next/head';
import { useTheme } from 'styled-components';

export default function HeadWithDefaults({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <Head>
      {title && <title>{title}</title>}
      <meta name="author" content="Guillermo de la Puente"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content={theme.global.colors.parchment.light}
        key="theme-color-light"
      ></meta>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content={theme.global.colors.parchment.dark}
        key="theme-color-dark"
      ></meta>
    </Head>
  );
}
