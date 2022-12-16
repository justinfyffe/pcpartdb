import Joi from '@hapi/joi';
import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { validate } from '@server/shared/types/validate';
import { benchmarksValidator } from '@shared/benchmark';
import {
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
import { reviewsValidator } from '@shared/review';
import { Specs, specsValidator } from '@shared/spec';
import { addPerformanceBenchmarks } from './benchmark-utils';
import { productRepository } from './product-repository';
import { filterProducts, limitProducts, sortProducts } from './product-utils';

const createProductValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  metas: productMetasValidator,
  specs: specsValidator,
  benchmarks: benchmarksValidator,
  reviews: reviewsValidator,
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
  reviews: reviewsValidator,
  images: productImagesValidator,
}).options({ abortEarly: false });

export class ProductService {
  async list(options: ListProductsRequest, ctx: Context) {
    const { type, filter, orderBy, limit } = options;

    // Fetch all products
    let products = await productRepository.list(type, ctx);

    products = filterProducts(products, filter);
    products = sortProducts(products, orderBy);
    products = limitProducts(products, limit);

    return products;
  }

  async get(idOrSlug: string | number, ctx: Context) {
    const product = isNaN(Number(idOrSlug))
      ? await this.getProductBySlug(idOrSlug as string, ctx)
      : await this.getProductById(Number(idOrSlug), ctx);

    if (product == null) {
      throw notFoundError(null);
    }

    return product;
  }

  async getComparison(idsOrSlugs: string, ctx: Context) {
    const parts = idsOrSlugs.split('--vs--');

    if (parts.length !== 2) {
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

  async getRelatedProducts(options: RelatedProductsRequest, ctx: Context) {
    const { type, seed, prioritize } = options;
    const limit = options.limit ?? 3;

    const gpus = await this.list({ type, orderBy: prioritize }, ctx);

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

  async populateRanks(products: Product | Product[], ctx: Context) {
    const productsArr = Array.isArray(products) ? products : [products];

    if (productsArr.length === 0) {
      return;
    }

    const type = productsArr[0].type;
    if (productsArr.some((product) => product.type !== type)) {
      throw new Error('Products must be of the same type when applying ranks');
    }

    const ids = productsArr.map((product) => product.id);
    const performanceRanks = await productRepository.getPerformanceRanks(
      ids,
      type,
      ctx,
    );
    const valueRanks = await productRepository.getValueRanks(ids, type, ctx);

    productsArr.forEach((product, i) => {
      product.metas = {
        ...product.metas,
        performanceRank: { value: performanceRanks[i] },
        valueRank: { value: valueRanks[i] },
      };
    });
  }
}

export const productService = new ProductService();
