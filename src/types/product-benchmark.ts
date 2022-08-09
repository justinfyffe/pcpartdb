import { schema } from 'normalizr';

export enum ProductBenchmarkKey {
  Passmark = 'PASSMARK',
  TimeSpy = '3DMARK_TIME_SPY',
}

export interface ProductBenchmark {
  key: ProductBenchmarkKey;
  value: number | string;
  source?: string;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');
