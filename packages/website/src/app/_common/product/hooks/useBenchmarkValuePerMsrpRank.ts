import { BenchmarkKey, getProductValueRank, Product } from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useBenchmarkValuePerMsrpRank(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return useMemo(() => {
    return getProductValueRank(product, benchmark) || null;
  }, [benchmark, product]);
}
