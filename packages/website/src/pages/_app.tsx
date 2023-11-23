import '../assets/styles/global.css';
import 'reflect-metadata';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import React from 'react';
import { ErrorPage } from '../client/errors/pages/ErrorPage/ErrorPage';
import { apiClient } from '../client/shared/api/apiClient';
import { LayoutContext } from '../client/shared/layouts/layout-context';

const MyApp = ({ Component, pageProps }: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { config, error } = pageProps as any;

  return (
    <LayoutContext.Provider value={{ fieldCounter: 0 }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Bing Ads */}
      {!config?.disableAds && (
        <>
          <Script
            key="ms-ads1"
            dangerouslySetInnerHTML={{
              __html: `
                window.msAdsQueue = window.msAdsQueue || [];
              `,
            }}
          />
          <Script
            key="ms-ads2"
            async
            src={`https://adsdk.microsoft.com/pubcenter/sdk.js?siteId=${config.bingAdsSiteId}&publisherId=${config.bingAdsPublisherId}`}
            crossOrigin="anonymous"
          ></Script>
        </>
      )}
      {/* Microsoft Clarity */}
      {config?.isStaff !== true && config?.enableClarity && (
        <>
          <Script
            key="ms-clarity1"
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${config?.clarityId}");
          `,
            }}
          />
        </>
      )}
      {/* Analytics */}
      {config?.isStaff !== true && config?.enableGoogleAnalytics && (
        <>
          <Script
            key="analytics1"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
          />
          <Script
            key="analytics2"
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${config.googleAnalyticsId}');
                `,
            }}
          />
        </>
      )}

      {/* <CacheHydration /> */}
      {error != null ? (
        <ErrorPage error={error} />
      ) : (
        <Component {...pageProps}></Component>
      )}
    </LayoutContext.Provider>
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
