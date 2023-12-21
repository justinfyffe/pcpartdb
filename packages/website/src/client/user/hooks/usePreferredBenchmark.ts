import {
  BenchmarkKey,
  getPreferredBenchmark,
  ProductType,
} from '@pcpartdb/shared';
import { useUserSettings } from '../context/UserSettingsContext';

export const usePreferredBenchmark = (
  productType: ProductType,
): BenchmarkKey => {
  const { userSettings } = useUserSettings();

  return getPreferredBenchmark(userSettings, productType);
};
