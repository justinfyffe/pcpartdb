import { ProductBenchmark } from './product-benchmark';
import { ProductSpec } from './product-spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export interface Product {
  id?: number;
  slug: string;

  type: ProductType;
  name: string;

  specs?: ProductSpec[];
  benchmarks?: ProductBenchmark[];
}
