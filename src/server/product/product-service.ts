import Joi from '@hapi/joi';
import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { validate } from '@server/shared/types/validate';
import { benchmarksValidator } from '@shared/benchmark';
import {
  FindComparisonRequest,
  FindProductRequest,
  ListProductsRequest,
  Product,
  ProductComparison,
  ProductRequest,
  ProductType,
  RelatedProducts,
  RelatedProductsRequest,
} from '@shared/product';
import { productImagesValidator } from '@shared/product-image';
import { ProductMetas, productMetasValidator } from '@shared/product-meta';
import { Specs, specsValidator } from '@shared/spec';
import { addPerformanceBenchmarks } from './benchmark-utils';
import { productRepository } from './product-repository';

const createProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  metas: productMetasValidator,
  specs: specsValidator,
  benchmarks: benchmarksValidator,
  images: productImagesValidator,
}).options({ abortEarly: false });

const updateProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  metas: productMetasValidator,
  specs: specsValidator,
  benchmarks: benchmarksValidator,
  images: productImagesValidator,
}).options({ abortEarly: false });

export class ProductService {
  async count(options: ListProductsRequest, ctx: Context) {
    const products = await productRepository.list(options, ctx);
    return products.length;
  }

  async list(options: ListProductsRequest, ctx: Context) {
    return await productRepository.list(options, ctx);
  }

  async get(options: FindProductRequest, ctx: Context) {
    const product = await productRepository.find(options, ctx);

    if (product == null) {
      throw notFoundError(null);
    }

    return product;
  }

  async getComparison(options: FindComparisonRequest, ctx: Context) {
    const { slug, includeImages, includeRanks } = options;
    const parts = slug.split('--vs--');

    if (parts.length !== 2) {
      throw badRequestError(null);
    }

    const promises = [];
    for (const part of parts) {
      promises.push(this.get({ slug: part, includeImages, includeRanks }, ctx));
    }
    const products = await Promise.all(promises);
    const filteredProducts = products.filter((product) => product != null);

    if (filteredProducts.length !== parts.length) {
      throw notFoundError(null);
    }

    return products;
  }

  async getRelatedProducts(options: RelatedProductsRequest, ctx: Context) {
    const { type, seed, prioritize } = options;
    const limit = options.limit ?? 3;

    const gpus = await this.list(
      { type, query: { orderBy: { sort: prioritize } } },
      ctx,
    );

    let seedIndex = 0;
    if (seed != null && 'id' in seed) {
      seedIndex = gpus.findIndex((gpu) => gpu.id === seed.id);
    } else if (Array.isArray(seed)) {
      seedIndex = gpus.findIndex((gpu) => gpu.id === seed[0].id);
    }

    const relatedGpus = new Map<number, Product>();
    const relatedComparisons = new Map<string, ProductComparison>();
    let prevProduct: Product = null;
    for (
      let i = 0;
      i < gpus.length &&
      (relatedGpus.size < limit || relatedComparisons.size < limit);
      ++i
    ) {
      prevProduct = gpus[seedIndex].serialize();

      seedIndex += (i + 1) * (i % 2 === 0 ? 1 : -1);
      seedIndex = Math.max(0, Math.min(seedIndex, gpus.length - 1));

      const gpu = gpus[seedIndex].serialize();
      relatedGpus.set(gpu.id, gpu);

      if (prevProduct.id !== gpu.id) {
        const comparison = [prevProduct, gpu].sort(
          (gpu1, gpu2) => gpu1.id - gpu2.id,
        ) as ProductComparison;

        relatedComparisons.set(
          comparison.map((value) => value.id).join(','),
          comparison,
        );
      }
    }

    return {
      comparisons: [...relatedComparisons.values()].slice(0, limit),
      gpus: [...relatedGpus.values()].slice(0, limit),
    } as RelatedProducts;
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

    const product = await productRepository.find({ id }, ctx);
    if (product == null) {
      throw notFoundError({ product: id });
    }

    return await productRepository.save({ ...data, id }, ctx);
  }

  async delete(id: number, ctx: Context) {
    const product = await productRepository.find({ id }, ctx);
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
