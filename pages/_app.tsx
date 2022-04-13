import type { AppProps } from 'next/app';
import { Grommet } from 'grommet';
import { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';

import theme from '../util/theme';
import ViewportSizeListener from '../components/ViewportSizeListener';
import { ThemeModeContextProvider } from '../components/ThemeModeContext';
import { useTheme } from 'styled-components';
import { NextPage } from 'next';

const ThemeDebugger: React.FC = () => {
  const theme = useTheme();
  useEffect(() => {
    console.log('[development] theme', theme);
  }, [theme]);
  return null;
};

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
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [, setSize] = useState<ResponsiveViewportSize>();

  const themeContextValue = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          height: 100%;
        }
        * {
          transition: background-color 0.2s;
        }
        ::placeholder {
          font-weight: normal;
          -webkit-font-smoothing: auto;
        }
      `}</style>
      <Grommet theme={theme} full themeMode={mode}>
        <ThemeModeContextProvider value={themeContextValue}>
          <ViewportSizeListener onSize={setSize} />
          {getLayout(<Component {...pageProps} />)}
          {process.env.NODE_ENV === 'development' && <ThemeDebugger />}
        </ThemeModeContextProvider>
      </Grommet>
    </>
  );
}

export default MyApp;
