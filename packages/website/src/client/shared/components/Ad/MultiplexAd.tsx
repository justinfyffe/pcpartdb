import React, { FunctionComponent, useEffect } from 'react';
import { useConfig } from '../../config/config-context';
import { Ad } from './Ad';
import { AD_UNITS, AdUnit } from './types';
import { isEmptyAd, isFakeAd } from './utils';

export interface MultiplexAdProps {
  unit: AdUnit;

  as?: React.ElementType;
  className?: string;
}

export const MultiplexAd: FunctionComponent<MultiplexAdProps> = (props) => {
  const { unit } = props;
  const { config } = useConfig();
  const clientId = `ca-${config.adsensePubId}`;
  const adUnitConfig = AD_UNITS[unit];

  const renderEmpty = isEmptyAd({ unit, config });
  const renderFake = isFakeAd({ unit, config });

  useEffect(() => {
    if (typeof window === 'object' && !renderFake && !renderEmpty) {
      // Request ad to be rendered
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    }
  }, [adUnitConfig.slotId, renderEmpty, renderFake]);

  return (
    <Ad {...props}>
      {adUnitConfig?.slotId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="autorelaxed"
          data-ad-client={clientId}
          data-ad-slot={adUnitConfig.slotId}
        ></ins>
      ) : (
        <></>
      )}
    </Ad>
  );
};
