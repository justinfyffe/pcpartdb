import { BenchmarkKey } from '../benchmarks';
import { RankType } from './types';

interface BuildProductRankKeyOptions {
  type: RankType;
  benchmark: BenchmarkKey;
}

export function buildProductRankKey(options: BuildProductRankKeyOptions) {
  return `${options.type.toLowerCase()}__${options.benchmark.toLowerCase()}`;
}
