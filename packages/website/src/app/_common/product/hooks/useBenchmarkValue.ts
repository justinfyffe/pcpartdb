import { BenchmarkKey, Product, productBenchmarkValue } from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useBenchmarkValue(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return useMemo(() => {
    return productBenchmarkValue(product, benchmark) || null;
  }, [benchmark, product]);
}
