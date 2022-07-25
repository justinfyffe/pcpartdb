import Joi from '@hapi/joi';
import { NormalizedSchema, schema } from 'normalizr';
import { ProductBenchmark, productBenchmarkSchema } from './product-benchmark';
import { ProductSpec, productSpecSchema } from './product-spec';

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

export interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;
}

interface ProductEntities {
  products: Record<string, Product>;
  specs: Record<string, ProductSpec>;
  benchmarks: Record<string, ProductBenchmark>;
}

export type ProductResponse = NormalizedSchema<ProductEntities, number>;
export type ProductsResponse = NormalizedSchema<ProductEntities, number[]>;

export const productSchema = new schema.Entity('products', {
  specs: [productSpecSchema],
  benchmarks: [productBenchmarkSchema],
});

export const createProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
}).options({ abortEarly: false });

export const updateProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
}).options({ abortEarly: false });
