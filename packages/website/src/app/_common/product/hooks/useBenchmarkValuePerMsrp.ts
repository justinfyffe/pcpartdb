import {
  BenchmarkKey,
  Product,
  productBenchmarkValuePerMsrp,
} from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useBenchmarkValuePerMsrp(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return useMemo(() => {
    return productBenchmarkValuePerMsrp(product, benchmark) || null;
  }, [benchmark, product]);
}
