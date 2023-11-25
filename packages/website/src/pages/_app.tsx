import '../assets/styles/global.css';
import 'reflect-metadata';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { ErrorPage } from '../client/errors/pages/ErrorPage/ErrorPage';
import { apiClient } from '../client/shared/api/apiClient';
import { ConfigContext } from '../client/shared/config/config-context';
import { LayoutContext } from '../client/shared/layouts/layout-context';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { config, error } = pageProps as any;

  return (
    <ConfigContext.Provider value={{ config }}>
      <LayoutContext.Provider value={{ fieldCounter: 0 }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        {/* <CacheHydration /> */}
        {error != null ? (
          <ErrorPage error={error} />
        ) : (
          <Component {...pageProps}></Component>
        )}
      </LayoutContext.Provider>
    </ConfigContext.Provider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Get app configuration used for all pages
  const config = await apiClient.get('config', {
    headers: { cookie: appContext.ctx.req?.headers?.cookie ?? '' },
  });

  // calls page's `getInitialProps` and fills `appProps.pageProps`
  let appProps;
  try {
    appProps = await App.getInitialProps(appContext);
    appProps.pageProps = { ...appProps.pageProps, config };
  } catch (error) {
    appProps = { pageProps: { error, config } };
  }

  return { ...appProps };
};

export default MyApp;
