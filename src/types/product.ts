import Joi from '@hapi/joi';
import { NormalizedSchema, schema } from 'normalizr';
import {
  createProductBenchmarkValidator,
  GpuProductBenchmark,
  ProductBenchmark,
  productBenchmarkSchema,
  updateProductBenchmarkValidator,
} from './product-benchmark';
import {
  createProductSpecValidator,
  GpuProductSpec,
  ProductSpec,
  productSpecSchema,
  updateProductSpecValidator,
} from './product-spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export interface Product<
  TSpec extends ProductSpec = ProductSpec,
  TBenchmark extends ProductBenchmark = ProductBenchmark,
> {
  id?: number;
  slug: string;

  type: ProductType;
  name: string;

  specs?: TSpec[];
  benchmarks?: TBenchmark[];
}

export interface GpuProduct
  extends Product<GpuProductSpec, GpuProductBenchmark> {}

export interface ProductFormData {
  slug: string;
  type: ProductType;
  name: string;

  specs: ProductSpec[];
  benchmarks: ProductBenchmark[];
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
  specs: Joi.array().items(createProductSpecValidator),
  benchmarks: Joi.array().items(createProductBenchmarkValidator),
}).options({ abortEarly: false });

export const updateProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  specs: Joi.array().items(
    createProductSpecValidator,
    updateProductSpecValidator,
  ),
  benchmarks: Joi.array().items(
    createProductBenchmarkValidator,
    updateProductBenchmarkValidator,
  ),
}).options({ abortEarly: false });
