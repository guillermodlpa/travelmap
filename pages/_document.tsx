import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/**
 * @see {@link https://nextjs.org/docs/advanced-features/custom-document}
 */
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      // See https://styled-components.com/docs/advanced#nextjs
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html dir="ltr" lang="en">
        {/* reminder from the docs https://nextjs.org/docs/advanced-features/custom-document
            The <Head /> component used in _document is not the same as next/head. The <Head /> component used here should only be used for any <head> code that is common for all pages.
        */}
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href={
              'https://fonts.googleapis.com/css2?family=Barlow&family=Merienda:wght@700&display=swap'
            }
            rel="stylesheet"
          />
          <meta name="author" content="Guillermo de la Puente"></meta>
          <link
            rel="shortcut icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗺</text></svg>"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
