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
  BenchmarkKey,
  CreateProductRequest,
  createProductRequestSchema,
  getPreferredBenchmark,
  GpuProduct,
  listAllProductsRequestSchema,
  ListProductsRequest,
  listProductsRequestSchema,
  ListProductsResponse,
  ListSort,
  Product,
  ProductComparison,
  ProductDiff,
  ProductFieldKey,
  productFieldRawValue,
  ProductSource,
  ProductType,
  ProductUpdate,
  ScrapeProductRequest,
  scrapeProductRequestSchema,
  UpdateProductRequest,
  updateProductRequestSchema,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { ProductRepository } from './product.repository';
import { ProductAutocompleteService } from './product-autocomplete.service';
import { ProductUpdateService } from './product-update.service';

interface ListOptions {
  fields?: ProductFieldKey[];

  includeAdditionalData?: boolean;
  includeAutomation?: boolean;
  includeBenchmarks?: boolean | BenchmarkKey[];
  includeImages?: boolean;
  includeRanks?: boolean | BenchmarkKey[];
  includeSources?: boolean;

  skipCount?: boolean;
}

interface GetOptions {
  fields?: ProductFieldKey[];
  parentFields?: ProductFieldKey[];
  relatedFields?: ProductFieldKey[];

  includeParent?: boolean;
  includeUpdates?: boolean;
  includeAutomation?: boolean;
  includeSources?: boolean;
  includeImages?: boolean;

  includeBenchmarks?: boolean | BenchmarkKey[];
  includeParentBenchmarks?: boolean | BenchmarkKey[];
  includeRelatedBenchmarks?: boolean | BenchmarkKey[];

  includeRanks?: boolean | BenchmarkKey[];
  includeParentRanks?: boolean | BenchmarkKey[];
  includeRelatedRanks?: boolean | BenchmarkKey[];

  includeRelated?: boolean;
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

@Injectable()
export class ProductService {
  constructor(
    private repository: ProductRepository,
    private autocompleteService: ProductAutocompleteService,
    @Inject(forwardRef(() => ProductUpdateService))
    private updateService: ProductUpdateService,
  ) {}

  async count(request: ListProductsRequest, ctx: Context) {
    validate(request, listProductsRequestSchema);

    const { query } = request;
    const productType = query?.filter?.productType;
    if (productType == null) {
      throw new Error('Invalid product type for list call');
    }

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

    const skipCount = options.skipCount ?? false;

    const includeAutomation =
      (options.includeAutomation ?? false) && (ctx.user?.isStaff ?? false);
    const includeBenchmarks = options?.includeBenchmarks ?? false;
    const includeImages = options?.includeImages ?? false;
    const includeRanks = options?.includeRanks ?? false;
    const includeSources =
      (options?.includeSources ?? false) && (ctx.user?.isStaff ?? false);

    const fields = options.fields;
    const includeFields = fields == null || fields.length > 0;

    const { query } = request;
    const productType = query?.filter?.productType;
    if (productType == null) {
      throw new Error('Invalid product type for list call');
    }

    // If list is sorted by perf or value, then we need to add the preferred
    // benchmark to order by it.
    if (
      query?.orderBy?.sort === ListSort.PerformanceRating ||
      query?.orderBy?.sort === ListSort.PerformancePerMsrp
    ) {
      const preferredBenchmark = getPreferredBenchmark(
        ctx.config?.userSettings,
        productType,
      );
      query.orderBy = { ...query.orderBy, benchmark: preferredBenchmark };
    }

    const productEntities = await this.repository.list(
      {
        ...query,
        ...options,
        includeBenchmarks: !!includeBenchmarks,
        includeFields,
        includeImages,
        includeRanks: !!includeRanks,
        includeSources,
        fields,
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
      includeRanks,
    });

    const response: ListProductsResponse = {
      query,
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

    const includeBenchmarks = options?.includeBenchmarks ?? false;
    const includeParentBenchmarks = options?.includeParentBenchmarks ?? false;
    const includeRelatedBenchmarks = options?.includeRelatedBenchmarks ?? false;

    const includeRanks = options?.includeRanks ?? false;
    const includeParentRanks = options?.includeParentRanks ?? false;
    const includeRelatedRanks = options?.includeRelatedRanks ?? false;

    const includeParent = options.includeParent ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources =
      (options.includeSources ?? false) && (ctx.user?.isStaff ?? false);
    const includeUpdates =
      (options.includeUpdates ?? false) && (ctx.user?.isStaff ?? false);
    const includeAutomation =
      (options.includeAutomation ?? false) && (ctx.user?.isStaff ?? false);
    const includeRelated = options?.includeRelated ?? false;

    const fields = options.fields;
    const parentFields = options.parentFields;
    const relatedFields = options.relatedFields;

    const includeFields = fields == null || fields.length > 0;
    const includeParentFields = parentFields == null || parentFields.length > 0;
    const includeRelatedFields =
      relatedFields == null || relatedFields.length > 0;

    const entity = await this.repository.findById(
      {
        id,

        includeBenchmarks: !!includeBenchmarks,
        includeParentBenchmarks: !!includeParentBenchmarks,
        includeRelatedBenchmarks: !!includeRelatedBenchmarks,

        includeRanks: !!includeRanks,
        includeParentRanks: !!includeParentRanks,
        includeRelatedRanks: !!includeRelatedRanks,

        includeParent,
        includeImages,
        includeSources,
        includeRelated,

        includeFields,
        includeParentFields,
        includeRelatedFields,

        fields,
        parentFields,
        relatedFields,
      },
      ctx,
    );

    const product = await mapToProductDto(entity, {
      includeParent,

      includeAutomation,
      includeImages,
      includeSources,
      includeUpdates,
      includeRelated,
      includeSummary: true,

      includeBenchmarks,
      includeParentBenchmarks,
      includeRelatedBenchmarks,

      includeRanks,
      includeParentRanks,
      includeRelatedRanks,

      fields,
      parentFields,
      relatedFields,
    });

    if (product == null) {
      throw notFoundError({ product: id });
    }

    return product;
  }

  async getBySlug(options: GetBySlugOptions, ctx: Context) {
    const productType = options.productType;
    const slug = options.slug;

    const includeBenchmarks = options?.includeBenchmarks ?? false;
    const includeParentBenchmarks = options?.includeParentBenchmarks ?? false;
    const includeRelatedBenchmarks = options?.includeRelatedBenchmarks ?? false;

    const includeRanks = options?.includeRanks ?? false;
    const includeParentRanks = options?.includeParentRanks ?? false;
    const includeRelatedRanks = options?.includeRelatedRanks ?? false;

    const includeParent = options.includeParent ?? false;
    const includeImages = options.includeImages ?? false;
    const includeSources =
      (options.includeSources ?? false) && (ctx.user?.isStaff ?? false);
    const includeUpdates =
      (options.includeUpdates ?? false) && (ctx.user?.isStaff ?? false);
    const includeAutomation =
      (options.includeAutomation ?? false) && (ctx.user?.isStaff ?? false);
    const includeRelated = options?.includeRelated ?? false;

    const fields = options.fields;
    const parentFields = options.parentFields;
    const relatedFields = options.relatedFields;

    const includeFields = fields == null || fields.length > 0;
    const includeParentFields = parentFields == null || parentFields.length > 0;
    const includeRelatedFields =
      relatedFields == null || relatedFields.length > 0;

    const entity = await this.repository.findBySlug(
      {
        productType,
        slug,

        includeBenchmarks: !!includeBenchmarks,
        includeParentBenchmarks: !!includeParentBenchmarks,
        includeRelatedBenchmarks: !!includeRelatedBenchmarks,

        includeRanks: !!includeRanks,
        includeParentRanks: !!includeParentRanks,
        includeRelatedRanks: !!includeRelatedRanks,

        includeParent,
        includeImages,
        includeSources,
        includeRelated,

        includeFields,
        includeParentFields,
        includeRelatedFields,

        fields,
        parentFields,
        relatedFields,
      },
      ctx,
    );

    const product = await mapToProductDto(entity, {
      includeParent,

      includeAutomation,
      includeImages,
      includeSources,
      includeUpdates,
      includeRelated,
      includeSummary: true,

      includeBenchmarks,
      includeParentBenchmarks,
      includeRelatedBenchmarks,

      includeRanks,
      includeParentRanks,
      includeRelatedRanks,

      fields,
      parentFields,
      relatedFields,
    });

    if (product == null) {
      throw notFoundError({ product: slug });
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

    const fetchPromises = slugs.map((slug) =>
      this.getBySlug(
        {
          ...options,
          productType: options.productType,
          slug,
        },
        ctx,
      ),
    );
    const products = await Promise.all(fetchPromises);

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

    // Update benchmarks' value per msrp
    const msrp = productFieldRawValue<number>(product.fields?.msrp);
    for (const benchmark of product.benchmarks ?? []) {
      if (benchmark.value && msrp) {
        benchmark.valuePerMsrp = benchmark.value / msrp;
      } else {
        benchmark.valuePerMsrp = null;
      }
    }

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

    // Update benchmarks' value per msrp
    const msrp = productFieldRawValue<number>(product.fields?.msrp);
    for (const benchmark of product.benchmarks ?? []) {
      if (benchmark.value && msrp) {
        benchmark.valuePerMsrp = benchmark.value / msrp;
      } else {
        benchmark.valuePerMsrp = null;
      }
    }

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
      let chipset: GpuProduct = null;
      for (let i = 0; i < sources.length; ++i) {
        const source = sources[i];
        if (source.sourceProductId != null) {
          const product = await this.getById(
            { id: source.sourceProductId },
            ctx,
          );
          chipset = product as GpuProduct;
        }
      }

      return await scrapeGpu({ chipset, sources });
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
    const product = await this.getById(
      { id: productId, includeSources: true, includeAutomation: true },
      ctx,
    );

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

  private async populateAdditionalListData(
    response: ListProductsResponse,
    ctx: Context,
  ) {
    const productType = response.query?.filter?.productType;
    if (productType === ProductType.Gpu) {
      const productIds = response.results.map((product) => product.id);
      const retailModelCounts = await this.countChildren({ productIds }, ctx);
      response.additionalData = { retailModelCounts };
    }
  }
}
