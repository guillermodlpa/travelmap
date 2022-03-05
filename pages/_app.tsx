import type { AppProps } from 'next/app';

/**
 * @see {@link https://nextjs.org/docs/advanced-features/custom-app}
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          height: 100%;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
