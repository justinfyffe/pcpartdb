import { BenchmarkKey } from '../benchmarks';
import { RelatedProductType } from './types';

interface BuildRelatedProductKeyOptions {
  type: RelatedProductType;
  benchmark: BenchmarkKey;
}

export function buildRelatedProductKey(options: BuildRelatedProductKeyOptions) {
  return `${options.benchmark.toLowerCase()}`; // `${options.type.toLowerCase()}__${options.benchmark.toLowerCase()}`;
}
