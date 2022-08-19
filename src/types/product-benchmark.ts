import { schema } from 'normalizr';

export enum ProductBenchmarkKey {
  Passmark = 'PASSMARK',
  TimeSpy = '3DMARK_TIME_SPY',
}

export type ProductBenchmarkValue = string;

export interface ProductBenchmark {
  key: ProductBenchmarkKey;
  value: number | string;
  source?: ProductBenchmarkValue;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');
