import '../assets/styles/global.css';
import 'reflect-metadata';
import { CacheHydration } from '@pcpartdb/website/client/shared/cache';
import { LayoutContext } from '@pcpartdb/website/client/shared/layouts';
import axios from 'axios';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import React from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { ctx, error } = pageProps as any;

  return (
    <LayoutContext.Provider value={{ fieldCounter: 0 }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {ctx?.enableGoogleAnalytics && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ctx.googleAnalyticsId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${ctx.googleAnalyticsId}');
                `,
            }}
          />
        </>
      )}

      <CacheHydration />
      {!error && <Component {...pageProps}></Component>}
    </LayoutContext.Provider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Need to add cookie directly to all server-side calls
  if (appContext.ctx.req) {
    axios.defaults.headers.common.Cookie =
      appContext.ctx.req.headers?.cookie ?? null;
  }

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  let appProps;
  try {
    appProps = await App.getInitialProps(appContext);
    appProps.pageProps = { ...appProps.pageProps };
  } catch (error) {
    appProps = { pageProps: { error } };
  }
  return { ...appProps };
};

export default MyApp;
