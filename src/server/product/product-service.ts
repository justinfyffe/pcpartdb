import Joi from '@hapi/joi';
import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { validate } from '@server/shared/types/validate';
import { benchmarkValidator } from '@shared/benchmark';
import { ProductRequest, ProductType } from '@shared/product';
import { ProductMetas, productMetaValidator } from '@shared/product-meta';
import { reviewValidator } from '@shared/review';
import { Specs, specValidator } from '@shared/spec';
import { addPerformanceBenchmarks } from './benchmark-utils';
import { productRepository } from './product-repository';

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
  specs: Joi.array().items(specValidator),
  benchmarks: Joi.array().items(benchmarkValidator),
  reviews: Joi.array().items(reviewValidator),
  images: Joi.array().items(productImageValidator),
}).options({ abortEarly: false });

const updateProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  meta: Joi.array().items(productMetaValidator),
  specs: Joi.array().items(specValidator),
  benchmarks: Joi.array().items(benchmarkValidator),
  reviews: Joi.array().items(reviewValidator),
  images: Joi.array().items(productImageValidator),
}).options({ abortEarly: false });

export enum OrderBy {
  Id = 'id',
  Name = 'name',
  PerformanceRating = 'performance_rating',
  ValueRating = 'value_rating',
  ReleaseDate = 'release_date',
}

interface ListOptions {
  type: ProductType;

  orderBy?: OrderBy;
  limit?: number;
}

export class ProductService {
  async list(options: ListOptions, ctx: Context) {
    const { type, limit } = options;

    // Fetch all products
    const products = await productRepository.list(type, ctx);

    // Apply Order By

    // Apply Limit
    if (limit != null) {
      products.splice(0, limit);
    }

    const ids = products.map((product) => product.id);
    const performanceRanks = await productRepository.getPerformanceRanks(
      ids,
      type,
      ctx,
    );
    const valueRanks = await productRepository.getValueRanks(ids, type, ctx);

    products.forEach((product, i) => {
      product.metas = {
        ...product.metas,
        performanceRank: { value: performanceRanks[i] },
        valueRank: { value: valueRanks[i] },
      };
    });

    return products;
  }

  async get(idOrSlug: string | number, ctx: Context) {
    const product = isNaN(Number(idOrSlug))
      ? await this.getProductBySlug(idOrSlug as string, ctx)
      : await this.getProductById(Number(idOrSlug), ctx);

    if (product == null) {
      throw notFoundError(null);
    }

    const performanceRank = await productRepository.getPerformanceRank(
      product.id,
      product.type,
      ctx,
    );
    const valueRank = await productRepository.getValueRank(
      product.id,
      product.type,
      ctx,
    );

    product.metas = {
      ...product.metas,
      performanceRank: { value: performanceRank },
      valueRank: { value: valueRank },
    };

    return product;
  }

  async getComparison(idsOrSlugs: string, ctx: Context) {
    const parts = idsOrSlugs.split('--vs--');

    if (parts.length === 0) {
      throw badRequestError(null);
    }

    const promises = [];
    for (const part of parts) {
      promises.push(this.get(part, ctx));
    }
    const products = await Promise.all(promises);
    const filteredProducts = products.filter((product) => product != null);

    if (filteredProducts.length !== parts.length) {
      throw notFoundError(null);
    }

    return products;
  }

  async getProductById(id: number, ctx: Context) {
    return await productRepository.findById(id, ctx);
  }

  async getProductBySlug(slug: string, ctx: Context) {
    return await productRepository.findBySlug(slug, ctx);
  }

  // TODO: check slug uniqueness
  async create(data: ProductRequest, ctx: Context) {
    validate(data, createProductValidator);

    addPerformanceBenchmarks(data);

    return await productRepository.save(data, ctx);
  }

  // TODO: check slug uniqueness
  async update(id: number, data: ProductRequest, ctx: Context) {
    validate(data, updateProductValidator);

    addPerformanceBenchmarks(data);

    const product = await productRepository.findById(id, ctx);
    if (product == null) {
      throw notFoundError({ product: id });
    }

    return await productRepository.save({ ...data, id }, ctx);
  }

  async delete(id: number, ctx: Context) {
    const product = await productRepository.findById(id, ctx);
    if (product == null) {
      throw notFoundError({ product: id });
    }

    await productRepository.delete(id, ctx);
    return id;
  }

  async autocomplete(type: ProductType, query: string, ctx: Context) {
    return await productRepository.findSimilarValue(type, query, ctx);
  }

  async autocompleteSpec(key: keyof Specs, query: string, ctx: Context) {
    return await productRepository.findSimilarSpecValue(key, query, ctx);
  }

  async autocompleteMeta(key: keyof ProductMetas, query: string, ctx: Context) {
    return await productRepository.findSimilarMetaValue(key, query, ctx);
  }
}

export const productService = new ProductService();
