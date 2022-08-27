import { schema } from 'normalizr';

export enum ProductBenchmarkKey {
  Passmark = 'PASSMARK',
  TimeSpy = '3DMARK_TIME_SPY',
}

export type ProductBenchmarkValue = string;

export interface ProductBenchmark {
  id?: number;
  productId?: number;

  key: ProductBenchmarkKey;
  value: ProductBenchmarkValue;
  source?: string;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');
