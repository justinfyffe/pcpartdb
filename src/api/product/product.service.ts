import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { ProductRequest, ProductType } from '../../types/product';
import { notFoundError } from '../shared/errors/errors';
import { ServiceContext } from '../shared/service/context';
import { validate } from '../shared/types/validate';
import { ProductRepository } from './product.repository';

const productMetaValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives()
    .try(Joi.number(), Joi.string(), Joi.object())
    .required(),
  source: Joi.string(),
}).options({ abortEarly: false });

const productSpecValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives()
    .try(Joi.number(), Joi.string(), Joi.object())
    .required(),
  source: Joi.string(),
}).options({ abortEarly: false });

const productBenchmarkValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  source: Joi.string(),
}).options({ abortEarly: false });

const productReviewValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  source: Joi.string(),
}).options({ abortEarly: false });

const createProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  meta: Joi.array().items(productMetaValidator),
  specs: Joi.array().items(productSpecValidator),
  benchmarks: Joi.array().items(productBenchmarkValidator),
  reviews: Joi.array().items(productReviewValidator),
}).options({ abortEarly: false });

const updateProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  meta: Joi.array().items(productMetaValidator),
  specs: Joi.array().items(productSpecValidator),
  benchmarks: Joi.array().items(productBenchmarkValidator),
  reviews: Joi.array().items(productReviewValidator),
}).options({ abortEarly: false });

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProductBySlug(slug: string, ctx: ServiceContext) {
    return await this.productRepository.findBySlug(slug, ctx);
  }

  // TODO: check slug uniqueness
  async create(data: ProductRequest, ctx: ServiceContext) {
    validate(data, createProductValidator);

    return await this.productRepository.save(
      {
        type: data.type,
        slug: data.slug,
        name: data.name,
        meta: data.meta,
        specs: data.specs,
        benchmarks: data.benchmarks,
        reviews: data.reviews,
      },
      ctx,
    );
  }

  // TODO: check slug uniqueness
  async update(id: number, data: ProductRequest, ctx: ServiceContext) {
    validate(data, updateProductValidator);

    const product = await this.productRepository.findById(id, ctx);
    if (product == null) {
      throw notFoundError({ product: id });
    }

    return await this.productRepository.save(
      {
        id,
        type: data.type,
        slug: data.slug,
        name: data.name,
        meta: data.meta.map((meta) => ({ ...meta, productId: id })),
        specs: data.specs.map((spec) => ({ ...spec, productId: id })),
        benchmarks: data.benchmarks.map((benchmark) => ({
          ...benchmark,
          productId: id,
        })),
        reviews: data.reviews.map((review) => ({
          ...review,
          productId: id,
        })),
      },
      ctx,
    );
  }

  async delete(id: number, ctx: ServiceContext) {
    const product = await this.productRepository.findById(id, ctx);
    if (product == null) {
      throw notFoundError({ product: id });
    }

    await this.productRepository.delete(id, ctx);
    return id;
  }
}
