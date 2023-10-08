import { ProductSourceKey } from '../product';

export function formatAutomationSourceName(key: ProductSourceKey) {
  if (key === ProductSourceKey.TechPowerUp) {
    return 'TechPowerUp';
  } else if (key === ProductSourceKey.PassMark) {
    return 'PassMark';
  } else if (key === ProductSourceKey.GeekBench) {
    return 'GeekBench';
  } else if (key === ProductSourceKey.UlBenchmarks) {
    return 'UL Benchmarks';
  } else {
    throw new Error(`Invalid source key: ${key}`);
  }
}
