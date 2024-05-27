import {
  BenchmarkKey,
  getProductPerformanceRank,
  Product,
} from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useBenchmarkValueRank(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return useMemo(() => {
    return getProductPerformanceRank(product, benchmark) || null;
  }, [benchmark, product]);
}
