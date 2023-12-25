import { Config } from '@pcpartdb/shared';
import { AD_UNITS, AdUnit } from './types';

interface IsEmptyAdOptions {
  unit: AdUnit;
  config: Config;
}

export function isEmptyAd(options: IsEmptyAdOptions) {
  const { unit, config } = options;
  const adUnitConfig = AD_UNITS[unit];

  return (
    config.disableAds || adUnitConfig?.enabled !== true || !adUnitConfig?.slotId
  );
}

interface IsFakeAdOptions {
  unit: AdUnit;
  config: Config;
}

export function isFakeAd(options: IsFakeAdOptions) {
  const { unit, config } = options;

  return (
    unit === AdUnit.Test ||
    config.isStaff ||
    config.env === 'dev' ||
    config.adsensePubId === 'pub-0'
  );
}
