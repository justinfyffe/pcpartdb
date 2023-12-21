import '../assets/styles/global.css';
import 'reflect-metadata';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import { ErrorPage } from '../client/errors/pages/ErrorPage/ErrorPage';
import { apiClient } from '../client/shared/api/apiClient';
import { ConfigContext } from '../client/shared/config/config-context';
import { LayoutContext } from '../client/shared/layouts/layout-context';
import { UserSettingsContext } from '../client/user/context/UserSettingsContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { config, error } = pageProps as any;

  const [userSettings, updateUserSettings] = useState(config?.userSettings);

  return (
    <ConfigContext.Provider value={{ config }}>
      <UserSettingsContext.Provider
        value={{ userSettings, updateUserSettings }}
      >
        <LayoutContext.Provider value={{ fieldCounter: 0 }}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>

          {/* <CacheHydration /> */}
          {error != null ? (
            <ErrorPage error={error} />
          ) : (
            <Component {...pageProps}></Component>
          )}
        </LayoutContext.Provider>
      </UserSettingsContext.Provider>
    </ConfigContext.Provider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Get app configuration used for all pages
  const config = await apiClient.get('config', {
    nextPageContext: appContext.ctx,
    preferredBenchmarks: {
      cpu: appContext.ctx?.query?.cpu_benchmark as string,
      gpu: appContext.ctx?.query?.gpu_benchmark as string,
    },
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
