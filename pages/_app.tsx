import type { AppProps } from 'next/app';
import { Grommet } from 'grommet';
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';

import theme from '../util/theme';
import ViewportSizeListener from '../components/ViewportSizeListener';
import { ThemeMode, ThemeModeContextProvider } from '../components/ThemeModeContext';
import { useTheme } from 'styled-components';
import type { NextPage } from 'next';
import ButtonCssFilter from '../components/ButtonCssFilter/ButtonCssFilter';
import Head from 'next/head';

function ThemeDevelopmentDebugger() {
  const theme = useTheme();
  useEffect(() => {
    console.log('[development] theme', theme);
  }, [theme]);
  return null;
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

/**
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [mode, setMode] = useState<ThemeMode | undefined>(undefined);
  const [, setSize] = useState<ResponsiveViewportSize>();

  const themeContextValue = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  const [moounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          height: 100%;
        }
        ::placeholder {
          font-weight: normal;
          -webkit-font-smoothing: auto;
        }
      `}</style>
      <Grommet
        theme={theme}
        full
        themeMode={mode || 'light'}
        background="map-background"
        style={{ visibility: moounted ? 'visible' : 'hidden' }}
      >
        <ThemeModeContextProvider value={themeContextValue}>
          <ViewportSizeListener onSize={setSize} />
          <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>
          {process.env.NODE_ENV === 'development' && <ThemeDevelopmentDebugger />}
          <ButtonCssFilter />
        </ThemeModeContextProvider>
      </Grommet>
    </>
  );
}

export default MyApp;
