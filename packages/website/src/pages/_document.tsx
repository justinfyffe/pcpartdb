import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const enableGtm = process.env.ENABLE_GTM === 'true';
    const gtmId = process.env.GTM_ID;

    return (
      <Html lang="en" className="bg-html">
        <Head>
          <link rel="dns-prefetch" href="https://www.googletagmanager.com/" />
          <meta charSet="utf-8" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/faviconapple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/faviconfavicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/faviconfavicon-16x16.png"
          />
          <link rel="manifest" href="/favicon/site.webmanifest"></link>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Sacramento&display=swap"
            rel="preconnect"
          />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Sacramento&display=swap"
            as="style"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900|Sacramento&display=swap"
          />
        </Head>
        <body>
          {enableGtm && gtmId && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                className="hidden invisible"
              ></iframe>
            </noscript>
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
