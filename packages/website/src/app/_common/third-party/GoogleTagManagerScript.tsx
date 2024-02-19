import { GoogleTagManager } from '@next/third-parties/google';
import { Config } from '@pcpartdb/shared';
import Script from 'next/script';
import React, { FunctionComponent } from 'react';

interface GoogleTagManagerScriptProps {
  config: Config;
}

export const GoogleTagManagerScript: FunctionComponent<
  GoogleTagManagerScriptProps
> = (props) => {
  const { config } = props;

  if (config?.enableGtm !== true || config?.gtmId == null) {
    return <></>;
  }

  return (
    <>
      <Script
        id="gtm-datalayer"
        strategy="beforeInteractive"
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
              'disableAds': ${config.disableAds ?? false}
            });
          `,
        }}
      />
      <GoogleTagManager gtmId={config.gtmId} />
    </>
  );
};
