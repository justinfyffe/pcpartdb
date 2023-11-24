import '../assets/styles/global.css';
import 'reflect-metadata';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
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
          {/* Google Tag Manager */}
          {config?.enableGtm && config?.gtmId && (
            <>
              <script>
                {`
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    'isStaffUser': ${config.isStaff ?? false}
                  })
                  window.dataLayer.push({
                    'env': '${config.env ?? 'dev'}'
                  })
                `}
              </script>
              <script>
                {`
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${config.gtmId}');
                `}
              </script>
            </>
          )}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {/* Google Tag Manager */}
        {config?.enableGtm && config?.gtmId && (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${config.gtmId}`}
                height="0"
                width="0"
                className="hidden invisible"
              ></iframe>
            </noscript>
          </>
        )}

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
