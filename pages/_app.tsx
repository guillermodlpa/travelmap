import type { AppProps } from 'next/app';
import { Grommet } from 'grommet';
import { useState } from 'react';

import theme from '../util/theme';
import ViewportSizeListener from '../components/ViewportSizeListener';
import { ThemeModeContextProvider } from '../components/ThemeModeContext/ThemeModeContext';

/**
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [size, setSize] = useState<string>();

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
      `}</style>
      <Grommet
        theme={theme}
        full={size === 'small' || size === undefined ? 'min' : true}
        themeMode={mode}
      >
        <ThemeModeContextProvider value={{ mode, setMode }}>
          <ViewportSizeListener onSize={setSize} />
          <Component {...pageProps} />
        </ThemeModeContextProvider>
      </Grommet>
    </>
  );
}

export default MyApp;
