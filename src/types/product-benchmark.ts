import { schema } from 'normalizr';

export enum CpuBenchmarkKey {}

export enum GpuBenchmarkKey {}

export type ProductBenchmarkKey = CpuBenchmarkKey | GpuBenchmarkKey;

export interface ProductBenchmark<T = unknown> {
  id?: number;
  productId: number;

  source?: string;
  key: ProductBenchmarkKey;
  value?: T;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');
