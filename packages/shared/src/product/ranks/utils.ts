import { BenchmarkKey } from '../benchmarks';
import { Product } from '../common';
import { RankType } from './common';

interface BuildProductRankKeyOptions {
  type: RankType;
  benchmark: BenchmarkKey;
}

export function buildProductRankKey(options: BuildProductRankKeyOptions) {
  return `${options.type.toLowerCase()}__${options.benchmark.toLowerCase()}`;
}

export function hasBenchmarkPerformanceRank(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductPerformanceRank(product, benchmarkKey) != null;
}

export function hasBenchmarkValueRank(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductValueRank(product, benchmarkKey) != null;
}

export function getProductRankObject(
  product: Partial<Product>,
  rankType: RankType,
  benchmark: BenchmarkKey,
) {
  const key = buildProductRankKey({ type: rankType, benchmark });
  return product?.ranks?.[key] ?? null;
}

export function getProductPerformanceRank(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.Performance, benchmark)?.rank;
}

export function getProductPerformanceTotalRanked(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.Performance, benchmark)?.total;
}

export function getProductValueRank(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.PerformancePerDollar, benchmark)
    ?.rank;
}

export function getProductValueTotalRanked(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.PerformancePerDollar, benchmark)
    ?.total;
}
