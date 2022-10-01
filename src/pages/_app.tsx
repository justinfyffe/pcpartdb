import '../assets/styles/global.css';
import 'reflect-metadata';
import axios from 'axios';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { CacheHydration } from '../web/shared/cache';
import { GonContext } from '../web/shared/gon';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { error } = pageProps;

  return (
    <GonContext.Provider value={{ fieldCounter: 0 }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CacheHydration />
      {!error && <Component {...pageProps}></Component>}
    </GonContext.Provider>
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
