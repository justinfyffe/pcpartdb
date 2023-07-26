import {
  CpuDataSourceKey,
  GpuDataSourceKey,
  ProductSourceKey,
} from '../product';

export function formatProductSourceName(key: ProductSourceKey) {
  if (key === CpuDataSourceKey.TechPowerUp) {
    return 'TechPowerUp';
  } else if (key === CpuDataSourceKey.PassMark) {
    return 'PassMark';
  } else if (key === CpuDataSourceKey.GeekBench) {
    return 'GeekBench';
  } else if (key === GpuDataSourceKey.TechPowerUp) {
    return 'TechPowerUp';
  } else if (key === GpuDataSourceKey.VideocardBenchmarks) {
    return 'PassMark';
  } else if (key === GpuDataSourceKey.UlBenchmarks) {
    return 'UL Benchmarks';
  } else {
    throw new Error(`Invalid source key: ${key}`);
  }
}
