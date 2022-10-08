import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { ProductRequest, ProductType } from '../../shared/product';
import { productBenchmarkValidator } from '../../shared/product-benchmark';
import { productMetaValidator } from '../../shared/product-meta';
import { productReviewValidator } from '../../shared/product-review';
import { productSpecValidator } from '../../shared/product-spec';
import { badRequestError, notFoundError } from '../shared/errors/errors';
import { ServiceContext } from '../shared/service/context';
import { validate } from '../shared/types/validate';
import { ProductRepository } from './product.repository';

const productImageValidator = Joi.object({
  imageId: Joi.number().required(),
  type: Joi.string().required(),
  metadata: Joi.any(),
}).options({ abortEarly: false });

const createProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  meta: Joi.array().items(productMetaValidator),
  specs: Joi.array().items(productSpecValidator),
  benchmarks: Joi.array().items(productBenchmarkValidator),
  reviews: Joi.array().items(productReviewValidator),
  images: Joi.array().items(productImageValidator),
}).options({ abortEarly: false });

const updateProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  meta: Joi.array().items(productMetaValidator),
  specs: Joi.array().items(productSpecValidator),
  benchmarks: Joi.array().items(productBenchmarkValidator),
  reviews: Joi.array().items(productReviewValidator),
  images: Joi.array().items(productImageValidator),
}).options({ abortEarly: false });

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async list(ctx: ServiceContext) {
    return await this.productRepository.list(ctx);
  }

  async get(idOrSlug: string | number, ctx: ServiceContext) {
    return isNaN(Number(idOrSlug))
      ? await this.getProductBySlug(idOrSlug as string, ctx)
      : await this.getProductById(Number(idOrSlug), ctx);
  }

  async getComparison(idsOrSlugs: string, ctx: ServiceContext) {
    const parts = idsOrSlugs.split('--vs--');

    if (parts.length === 0) {
      throw badRequestError();
    }

    const promises = [];
    for (const part of parts) {
      promises.push(this.get(part, ctx));
    }
    const products = await Promise.all(promises);
    const filteredProducts = products.filter((product) => product != null);

    if (filteredProducts.length !== parts.length) {
      throw notFoundError({});
    }

    return products;
  }

  async getProductById(id: number, ctx: ServiceContext) {
    return await this.productRepository.findById(id, ctx);
  }

  async getProductBySlug(slug: string, ctx: ServiceContext) {
    return await this.productRepository.findBySlug(slug, ctx);
  }

  // TODO: check slug uniqueness
  async create(data: ProductRequest, ctx: ServiceContext) {
    validate(data, createProductValidator);

    return await this.productRepository.save({ ...data }, ctx);
  }

  // TODO: check slug uniqueness
  async update(id: number, data: ProductRequest, ctx: ServiceContext) {
    validate(data, updateProductValidator);

    const product = await this.productRepository.findById(id, ctx);
    if (product == null) {
      throw notFoundError({ product: id });
    }

    return await this.productRepository.save({ ...data, id }, ctx);
  }

  async delete(id: number, ctx: ServiceContext) {
    const product = await this.productRepository.findById(id, ctx);
    if (product == null) {
      throw notFoundError({ product: id });
    }

    await this.productRepository.delete(id, ctx);
    return id;
  }

  async autocomplete(type: ProductType, query: string, ctx: ServiceContext) {
    return await this.productRepository.findSimilarValue(type, query, ctx);
  }
}
