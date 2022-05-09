import Head from 'next/head';
import { useTheme } from 'styled-components';

export default function HeadWithDefaults({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <Head>
      {title && <title>{title}</title>}
      <meta
        name="theme-color"
        content={
          theme.dark ? theme.global.colors.parchment.dark : theme.global.colors.parchment.light
        }
      ></meta>
    </Head>
  );
}
