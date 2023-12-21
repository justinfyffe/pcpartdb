import { getDefaultBenchmark, ProductType } from '../product';
import { UserSettings } from './user-types';

export function getPreferredBenchmark(
  settings: UserSettings,
  productType: ProductType,
) {
  return (
    settings?.preferredBenchmarks?.[productType] ??
    getDefaultBenchmark(productType)
  );
}
