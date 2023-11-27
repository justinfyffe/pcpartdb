import Script from 'next/script';
import React, { FunctionComponent } from 'react';
import { useConfig } from '../config/config-context';

interface GoogleTagManagerScriptProps {}

export const GoogleTagManagerScript: FunctionComponent<
  GoogleTagManagerScriptProps
> = (props) => {
  const { config } = useConfig();

  if (config?.enableGtm !== true || config?.gtmId == null) {
    return <></>;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'isStaffUser': ${config.isStaff ?? false}
            });
            window.dataLayer.push({
              'env': '${config.env ?? 'dev'}'
            });
            window.dataLayer.push({
              'disableAds': '${config.disableAds}'
            });
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${config.gtmId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${config.gtmId}`}
          height="0"
          width="0"
          className="hidden invisible"
        ></iframe>
      </noscript>
    </>
  );
};
