import Joi from '@hapi/joi';
import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { validate } from '@server/shared/types/validate';
import { benchmarksValidator, compareBenchmarks } from '@shared/benchmark';
import {
  ListProductsRequest,
  ProductRequest,
  ProductsOrderBy,
  ProductType,
} from '@shared/product';
import { productImagesValidator } from '@shared/product-image';
import { ProductMetas, productMetasValidator } from '@shared/product-meta';
import { reviewsValidator } from '@shared/review';
import { compareSpecs, Specs, specsValidator } from '@shared/spec';
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

    // Apply filters
    if (filter != null) {
      products = products.filter((product) => {
        let result = true;
        if (filter.company != null) {
          result =
            result &&
            filter.company.toLowerCase() ===
              product.specs?.company?.value?.toLowerCase();
        }
        return result;
      });
    }

    // Apply ordering
    if (orderBy === ProductsOrderBy.Id) {
      products.sort((p1, p2) => p1.id - p2.id);
    } else if (orderBy === ProductsOrderBy.Name) {
      products.sort((p1, p2) => p1.name.localeCompare(p2.name));
    } else if (orderBy === ProductsOrderBy.ReleaseDate) {
      // DESC
      products.sort((p1, p2) =>
        compareSpecs(p2.specs?.releaseDate, p1.specs?.releaseDate),
      );
    } else if (orderBy === ProductsOrderBy.PerformanceRating) {
      // DESC
      products.sort((p1, p2) =>
        compareBenchmarks(
          p2.benchmarks?.performanceScore,
          p1.benchmarks?.performanceScore,
        ),
      );
    } else if (orderBy === ProductsOrderBy.ValueRating) {
      // DESC
      products.sort((p1, p2) =>
        compareBenchmarks(p2.benchmarks?.valueScore, p1.benchmarks?.valueScore),
      );
    } else {
      // Default sort - performance
      // DESC
      products.sort((p1, p2) =>
        compareBenchmarks(
          p2.benchmarks?.performanceScore,
          p1.benchmarks?.performanceScore,
        ),
      );
    }

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
