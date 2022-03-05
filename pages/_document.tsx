import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

/**
 * @see {@link https://nextjs.org/docs/advanced-features/custom-document}
 */
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href={'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap'} />
          <link rel="icon" href="/favicon.ico" />
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
