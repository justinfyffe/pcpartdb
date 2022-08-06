import { schema } from 'normalizr';

export enum CpuBenchmarkKey {}

export enum GpuBenchmarkKey {}

export type ProductBenchmarkKey = CpuBenchmarkKey | GpuBenchmarkKey;

export interface ProductBenchmark<T = unknown> {
  source?: string;
  key: ProductBenchmarkKey;
  value?: T;
}

export interface CpuProductBenchmark<T = unknown> extends ProductBenchmark<T> {
  key: CpuBenchmarkKey;
}
export interface GpuProductBenchmark<T = unknown> extends ProductBenchmark<T> {
  key: GpuBenchmarkKey;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');
