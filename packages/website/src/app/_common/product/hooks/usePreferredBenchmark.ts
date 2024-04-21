'use client';

import { ProductType } from '@pcpartdb/shared';
import { useUserSettings } from '../../contexts/UserSettingsProvider';

export function usePreferredBenchmark(productType: ProductType) {
  const { userSettings } = useUserSettings();
  return userSettings.preferredBenchmarks?.[productType];
}
