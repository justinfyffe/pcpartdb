import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  mapToProductDto,
  mapToProductDtos,
  mapToProductEntity,
} from '@pcpartdb/database';
import { scrapeCpu, scrapeGpu } from '@pcpartdb/scraper';
import {
  AutocompleteProductsRequest,
  autocompleteProductsRequestSchema,
  AutomationSource,
  BenchmarKey,
  CreateProductRequest,
  createProductRequestSchema,
  listAllProductsRequestSchema,
  ListProductsRequest,
  listProductsRequestSchema,
  ListProductsResponse,
  Product,
  ProductComparison,
  ProductDiff,
  ProductFieldKey,
  productFieldRawValue,
  ProductPerformanceScores,
  ProductRankKey,
  ProductSource,
  ProductType,
  ProductUpdate,
  ScrapeProductRequest,
  scrapeProductRequestSchema,
  sleep,
  UpdateProductRequest,
  updateProductRequestSchema,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Database } from '../database';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { ProductRepository } from './product.repository';
import { ProductAutocompleteService } from './product-autocomplete.service';
import { ProductRanksService } from './product-ranks.service';
import { ProductUpdateService } from './product-update.service';

interface ListOptions {
  fields?: ProductFieldKey[];

  includeAdditionalData?: boolean;
  includeSources?: boolean;
  includeAutomation?: boolean;
  includeImages?: boolean;
  includeBenchmarks?: boolean;
  includeRanks?: ProductRankKey[];

  skipCount?: boolean;
}

interface GetOptions {
  parentFields?: ProductFieldKey[];
  childrenFields?: ProductFieldKey[];

  includeParent?: boolean;
  includeChildren?: boolean;
  includeUpdates?: boolean;
  includeAutomation?: boolean;
  includeSources?: boolean;
  includeImages?: boolean;
  includeBenchmarks?: boolean;
  includeRanks?: ProductRankKey[];
}

interface GetByIdOptions extends GetOptions {
  id: number;
}

interface GetBySlugOptions extends GetOptions {
  productType: ProductType;
  slug: string;
}

interface GetComparisonOptions extends GetOptions {
  productType: ProductType;
  slug: string;
}

interface AutocompleteProductsOptions {
  fields?: ProductFieldKey[];
}

interface ApplyAutomationSourcesOptions {
  productId: number;
  sources: AutomationSource[];
}

interface ApplyProductUpdateOptions {
  slug?: string;
}

interface CountChildrenOptions {
  productIds: number[];
}

interface ApplyProductPerformanceScoresOption {
  productType: ProductType;
  scores: ProductPerformanceScores[];
}

@Injectable()
export class ProductService {
  constructor(
    private repository: ProductRepository,
    private rankService: ProductRanksService,
    private autocompleteService: ProductAutocompleteService,
    @Inject(forwardRef(() => ProductUpdateService))
    private updateService: ProductUpdateService,
    private db: Database,
  ) {}

  async count(request: ListProductsRequest, ctx: Context) {
    validate(request, listProductsRequestSchema);

    const { productType, query } = request;
    const count = await this.repository.count({ ...query, productType }, ctx);

    return count;
  }

  async list(
    request: ListProductsRequest,
    options: ListOptions,
    ctx: Context,
  ): Promise<ListProductsResponse> {
    if (ctx.user?.isStaff) {
      validate(request, listAllProductsRequestSchema);
    } else {
      validate(request, listProductsRequestSchema);
    }

    const includeBenchmarks = options?.includeBenchmarks ?? false;
    const includeImages = options?.includeImages ?? false;
    const includeSources =
      (options?.includeSources ?? false) && (ctx.user?.isStaff ?? false);
    const includeAutomation =
      (options.includeAutomation ?? false) && (ctx.user?.isStaff ?? false);

    const fields = options.fields != null ? new Set(options.fields) : null;
    const includeFields = fields == null || fields.size > 0;

    const skipCount = options.skipCount ?? false;

    const { productType, query } = request;
    const productEntities = await this.repository.list(
      {
        ...query,
        ...options,
        productType,
        includeFields,
        includeBenchmarks,
        includeImages,
        includeSources,
      },
      ctx,
    );

    let count: number;
    if (!skipCount) {
      count = await this.count(request, ctx);
    }

    const products: Product[] = await mapToProductDtos(productEntities, {
      fields,
      includeBenchmarks,
      includeSources,
      includeAutomation,
    });

    if (options.includeRanks) {
      await this.rankService.populateRanks(options.includeRanks, products, ctx);
    }

    const response: ListProductsResponse = {
      query,
      productType,
      results: products,
      total: count,
    };

    if (options.includeAdditionalData) {
      await this.populateAdditionalListData(response, ctx);
    }

    return response;
  }

  async getById(options: GetByIdOptions, ctx: Context) {
    const id = options.id;

    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources =
      (options.includeSources ?? false) && (ctx.user?.isStaff ?? false);
    const includeUpdates =
      (options.includeUpdates ?? false) && (ctx.user?.isStaff ?? false);
    const includeAutomation =
      (options.includeAutomation ?? false) && (ctx.user?.isStaff ?? false);
    const includeBenchmarks = options.includeBenchmarks ?? false;

    const parentFields =
      options.parentFields != null ? new Set(options.parentFields) : null;
    const childrenFields =
      options.childrenFields != null ? new Set(options.childrenFields) : null;

    const entity = await this.repository.findById(
      {
        id,
        includeParent,
        includeChildren,
        includeImages,
        includeSources,
        includeBenchmarks,
      },
      ctx,
    );
    const product = await mapToProductDto(entity, {
      parentFields,
      childrenFields,
      includeBenchmarks,
      includeParent,
      includeChildren,
      includeSources,
      includeAutomation,
      includeUpdates,
    });

    if (product == null) {
      throw notFoundError({ product: id });
    }

    if (options.includeRanks) {
      await this.rankService.populateRanks(
        options.includeRanks,
        [product, product.parent],
        ctx,
      );
    }

    return product;
  }

  async getBySlug(options: GetBySlugOptions, ctx: Context) {
    const productType = options.productType;
    const slug = options.slug;

    // TODO: read from cache

    const includeParent = options.includeParent ?? false;
    const includeChildren = options.includeChildren ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources =
      (options.includeSources ?? false) && (ctx.user?.isStaff ?? false);
    const includeUpdates =
      (options.includeUpdates ?? false) && (ctx.user?.isStaff ?? false);
    const includeAutomation =
      (options.includeAutomation ?? false) && (ctx.user?.isStaff ?? false);
    const includeBenchmarks = options.includeBenchmarks ?? false;

    const parentFields =
      options.parentFields != null ? new Set(options.parentFields) : null;
    const childrenFields =
      options.childrenFields != null ? new Set(options.childrenFields) : null;

    const entity = await this.repository.findBySlug(
      {
        productType,
        slug,
        includeParent,
        includeChildren,
        includeImages,
        includeSources,
        includeBenchmarks,
      },
      ctx,
    );
    const product = await mapToProductDto(entity, {
      parentFields,
      childrenFields,
      includeBenchmarks,
      includeParent,
      includeChildren,
      includeSources,
      includeAutomation,
      includeUpdates,
    });

    if (product == null) {
      throw notFoundError({ product: slug });
    }

    if (options.includeRanks) {
      await this.rankService.populateRanks(
        options.includeRanks,
        [product, product.parent],
        ctx,
      );
    }

    return product;
  }

  async getComparison(options: GetComparisonOptions, ctx: Context) {
    const comparisonSlug = options.slug;
    const slugs = comparisonSlug.split('--vs--');

    if (slugs.length !== 2) {
      throw notFoundError({ comparison: comparisonSlug });
    } else if (slugs[0] === slugs[1]) {
      throw notFoundError({ comparison: comparisonSlug });
    }

    const products: Product[] = [];
    for (const slug of slugs) {
      const product = await this.getBySlug(
        {
          ...options,
          productType: options.productType,
          slug,
        },
        ctx,
      );

      if (product != null) {
        products.push(product);
      }
    }

    const [product1, product2] = products;
    if (product1.parentId != null || product2.parentId != null) {
      // Cannot compare GPU retail models
      throw notFoundError(null);
    }

    return products as ProductComparison;
  }

  async create(request: CreateProductRequest, ctx: Context) {
    validate(request, createProductRequestSchema);

    const product = request.product;

    // Check if another product exists at the slug
    const existingProduct = await this.repository.findBySlug(
      { productType: product.productType, slug: product.slug },
      ctx,
    );

    if (existingProduct != null) {
      throw badRequestError({
        property: 'slug',
        constraint: ValidationErrorType.ProductExistsAtSlug,
      });
    }

    this.populatePerformanceRatings(product);

    const entity = mapToProductEntity({ id: undefined, ...product });
    const result = await this.repository.create(entity, ctx);
    return mapToProductDto(result);
  }

  async update(id: number, request: UpdateProductRequest, ctx: Context) {
    validate(request, updateProductRequestSchema);

    const product = request.product;

    // Check if another product exists at the slug
    const existingProduct = await this.repository.findBySlug(
      { productType: product.productType, slug: product.slug },
      ctx,
    );
    if (existingProduct != null && existingProduct.id !== id) {
      throw badRequestError({
        property: 'slug',
        constraint: ValidationErrorType.ProductExistsAtSlug,
      });
    }

    // Auto-reject any existing pending updates, we assume this update is more
    // updated than what is pending.
    const pendingUpdate = await this.updateService.findPendingByProductId(
      { productId: id },
      ctx,
    );
    if (pendingUpdate != null) {
      await this.updateService.reject(pendingUpdate.id, {}, ctx);
    }

    this.populatePerformanceRatings(product);

    const entity = mapToProductEntity({ id: undefined, ...product });
    const result = await this.repository.update(id, entity, ctx);
    return mapToProductDto(result);
  }

  async delete(id: number, ctx: Context) {
    const product = await this.repository.findById({ id }, ctx);
    if (product == null) {
      throw notFoundError({ gpu: id });
    }

    await this.repository.delete(id, ctx);
    return id;
  }

  async autocomplete(
    request: AutocompleteProductsRequest,
    options: AutocompleteProductsOptions,
    ctx: Context,
  ) {
    validate(request, autocompleteProductsRequestSchema);

    const { productType, query } = request;
    return await this.autocompleteService.autocomplete(
      { productType, query: query || '', fields: options.fields },
      ctx,
    );
  }

  async scrape(request: ScrapeProductRequest, ctx: Context) {
    validate(request, scrapeProductRequestSchema);
    const { productType, sources } = request;

    if (productType === ProductType.Cpu) {
      return await scrapeCpu({ sources });
    } else if (productType === ProductType.Gpu) {
      for (let i = 0; i < sources.length; ++i) {
        const source = sources[i];
        if (source.sourceProductId != null) {
          const sourceProduct = await this.getById(
            { id: source.sourceProductId },
            ctx,
          );
          source.sourceProduct = sourceProduct;
        }
      }

      return await scrapeGpu({ sources });
    }

    throw badRequestError({
      property: 'productType',
      constraint: ValidationErrorType.InvalidProductType,
    });
  }

  async applyAutomationSources(
    options: ApplyAutomationSourcesOptions,
    ctx: Context,
  ) {
    const { productId, sources } = options;
    const product = await this.getById({ id: productId }, ctx);

    if (product == null) {
      throw notFoundError({ productId });
    }

    const sourceProductId = sources
      .filter((source) => source.relatedProductId)
      .map((source) => source.relatedProductId)[0];
    if (sourceProductId != null) {
      product.parentId = sourceProductId;
    }

    const existingSources = product.sources || [];
    sources.forEach((source) => {
      const existingSource = existingSources.find(
        ({ sourceKey }) => sourceKey === source.sourceKey,
      );

      if (existingSource) {
        existingSource.sourceUrl = source.sourceUrl;
      } else {
        existingSources.push({
          sourceKey: source.sourceKey,
          sourceUrl: source.sourceUrl,
        } as ProductSource);
      }
    });
    product.sources = existingSources;

    await this.update(productId, { product }, ctx);
  }

  async applyProductUpdate(
    update: ProductUpdate<ProductDiff>,
    options: ApplyProductUpdateOptions,
    ctx: Context,
  ) {
    const updated = update.data.updated as Product;
    if (update.productId != null) {
      await this.update(update.productId, { product: updated }, ctx);
    } else {
      const product = {
        ...updated,
        slug: options.slug || updated.slug,
      };
      await this.create({ product }, ctx);
    }
  }

  async countChildren(options: CountChildrenOptions, ctx: Context) {
    return await this.repository.countChildren(options, ctx);
  }

  async applyPerformanceScores(
    options: ApplyProductPerformanceScoresOption,
    ctx: Context,
  ) {
    const { productType, scores: scoresList } = options;

    await this.db.transaction(
      async () => {
        await this.repository.applyPerformanceScores(
          productType,
          scoresList,
          ctx,
        );
      },
      { ctx, timeout: 120_000 },
    );
  }

  private populatePerformanceRatings(product: Product) {
    switch (product.productType) {
      case ProductType.Cpu:
        this.populateCpuPerformanceRatings(product);
        break;
      case ProductType.Gpu:
        this.populateGpuPerformanceRatings(product);
        break;
    }
  }

  private populateCpuPerformanceRatings(product: Product) {
    if (product.fields == null) {
      throw new Error('Missing fields on product');
    }

    const cpuMarkMulti = product.benchmarks?.filter(
      (benchmark) => benchmark.benchmarkKey === BenchmarKey.CpuMarkMultiThread,
    )[0];

    if (cpuMarkMulti?.value == null) {
      // No performance rating to calculate
      return;
    }

    const performance = cpuMarkMulti.value;
    product.fields.performanceRating = {
      value: performance,
      meta: {
        fieldKey: 'performanceRating',
        autoUpdate: true,
        formattedValue: performance.toLocaleString(),
      },
    };

    const msrp = productFieldRawValue(product.fields.msrp);
    if (msrp != null) {
      const value = performance / msrp;
      product.fields.performancePerMsrp = {
        value,
        meta: {
          fieldKey: 'performancePerMsrp',
          autoUpdate: true,
          formattedValue: value.toFixed(2),
        },
      };
    }
  }

  private populateGpuPerformanceRatings(product: Product) {
    if (product.fields == null) {
      throw new Error('Missing fields on product');
    }

    const g3dMark = product.benchmarks?.filter(
      (benchmark) => benchmark.benchmarkKey === BenchmarKey.G3dMark,
    )[0];

    if (g3dMark?.value == null) {
      // No performance rating to calculate
      return;
    }

    const performance = g3dMark.value;
    product.fields.performanceRating = {
      value: performance,
      meta: {
        fieldKey: 'performanceRating',
        autoUpdate: true,
        formattedValue: performance.toLocaleString(),
      },
    };

    const msrp = productFieldRawValue(product.fields.msrp);
    if (msrp != null) {
      const value = performance / msrp;
      product.fields.performancePerMsrp = {
        value,
        meta: {
          fieldKey: 'performancePerMsrp',
          autoUpdate: true,
          formattedValue: value.toFixed(2),
        },
      };
    }
  }

  private async populateAdditionalListData(
    response: ListProductsResponse,
    ctx: Context,
  ) {
    if (response.productType === ProductType.Gpu) {
      const productIds = response.results.map((product) => product.id);
      const retailModelCounts = await this.countChildren({ productIds }, ctx);
      response.additionalData = { retailModelCounts };
    }
  }
}
