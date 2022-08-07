import { schema } from 'normalizr';

export enum ProductBenchmarkKey {
  Passmark = 'PASSMARK',
  TimeSpy = '3DMARK_TIME_SPY',
}

export interface ProductBenchmark<T = unknown> {
  source?: string;
  key: ProductBenchmarkKey;
  value?: T;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');
