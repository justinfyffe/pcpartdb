import Joi from '@hapi/joi';
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

export interface ProductBenchmarkFormData {
  key: ProductBenchmarkKey;
  value?: unknown;
  source?: string;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');

export const createProductBenchmarkValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.any(),
  source: Joi.string(),
}).options({ abortEarly: false });

export const updateProductBenchmarkValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.any(),
  source: Joi.string(),
}).options({ abortEarly: false });
