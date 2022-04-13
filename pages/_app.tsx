import type { AppProps } from 'next/app';
import { Grommet } from 'grommet';
import { useEffect, useState } from 'react';

import theme from '../util/theme';
import ViewportSizeListener from '../components/ViewportSizeListener';
import { ThemeModeContextProvider } from '../components/ThemeModeContext';
import { useTheme } from 'styled-components';

const ThemeDebugger: React.FC = () => {
  const theme = useTheme();
  useEffect(() => {
    console.log('[development] theme', theme);
  }, [theme]);
  return null;
};

/**
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [, setSize] = useState<ResponsiveViewportSize>();

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
        <ThemeModeContextProvider value={{ mode, setMode }}>
          <ViewportSizeListener onSize={setSize} />
          <Component {...pageProps} />
          {process.env.NODE_ENV === 'development' && <ThemeDebugger />}
        </ThemeModeContextProvider>
      </Grommet>
    </>
  );
}

export default MyApp;
