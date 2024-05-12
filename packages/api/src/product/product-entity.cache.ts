import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  CpuFieldsEntity,
  GameEntity,
  GpuFieldsEntity,
  ProductBenchmarkEntity,
  ProductEntity,
  ProductImageEntity,
  ProductSourceEntity,
} from '@pcpartdb/database';
import { concurrent, ProductType } from '@pcpartdb/shared';
import { ProductGameFpsEntity } from 'packages/database/src/product/ProductGameFpsEntity';
import { ProductRanksEntity } from 'packages/database/src/product/ProductRankEntity';
import { RelatedProductEntity } from 'packages/database/src/product/RelatedProductEntity';
import { GameEntityCache } from '../game/game-entity.cache';
import { CacheService, CacheType } from '../shared/cache/cache.service';
import { Context } from '../shared/context';
import {
  ProductBenchmarkRepository,
  ProductFieldsRepository,
  ProductGameFpsRepository,
  ProductImageRepository,
  ProductRanksRepository,
  ProductRepository,
  ProductSourceRepository,
  RelatedProductRepository,
} from './repositories';

interface GetProductByIdOptions extends RelationOptions {
  id: number;
  bypassCache?: boolean;
}

interface GetProductsByIdsOptions extends RelationOptions {
  ids: number[];
  bypassCache?: boolean;
}

interface GetProductBySlugOptions extends RelationOptions {
  productType: ProductType;
  slug: string;
  bypassCache?: boolean;
}

interface InvalidateOptions {
  id: number;
}

interface RelationOptions {
  includeRelated?: boolean;

  includeBaseFields?: boolean;
  includeRelatedFields?: boolean;

  includeBaseBenchmarks?: boolean;
  includeRelatedBenchmarks?: boolean;

  includeBaseGameFps?: boolean;
  includeRelatedGameFps?: boolean;

  includeBaseRanks?: boolean;
  includeRelatedRanks?: boolean;

  includeBaseImages?: boolean;
  includeRelatedImages?: boolean;

  includeBaseSources?: boolean;
  includeRelatedSources?: boolean;
}

interface PopulateOptions extends RelationOptions {
  products: ProductEntity[];
  bypassCache?: boolean;
}

interface GetProductIdsOptions {
  products: ProductEntity[];
  base?: boolean;
  related?: boolean;
}

interface GetProductMapOptions {
  products: ProductEntity[];
  base?: boolean;
  related?: boolean;
}

interface GetProductIdsToFetchOptions<TData = unknown> {
  // One or the other
  ids?: number[];
  products?: ProductEntity[];

  base?: boolean;
  related?: boolean;

  cacheType: CacheType;
  onCacheHit?: (id: number, data: TData) => void;
  bypassCache?: boolean;
}

@Injectable()
export class ProductEntityCache {
  constructor(
    private cacheService: CacheService,
    private productRepository: ProductRepository,
    private productFieldsRepository: ProductFieldsRepository,
    private productBenchmarkRepository: ProductBenchmarkRepository,
    private productGameFpsRepository: ProductGameFpsRepository,
    private productRanksRepository: ProductRanksRepository,
    private productImageRepository: ProductImageRepository,
    private productSourceRepository: ProductSourceRepository,
    private relatedProductRepository: RelatedProductRepository,
    @Inject(forwardRef(() => GameEntityCache))
    private gameEntityCache: GameEntityCache,
  ) {}

  async getProductById(options: GetProductByIdOptions, ctx: Context) {
    const products = await this.getProductsByIds(
      { ...options, ids: [options.id] },
      ctx,
    );

    return products?.[0] || null;
  }

  async getProductsByIds(options: GetProductsByIdsOptions, ctx: Context) {
    // Need to use map to maintain order.
    const productsMap = new Map<number, ProductEntity>();
    for (const id of options.ids) {
      productsMap.set(id, null);
    }

    // IDs of products that are not cached.
    // Also populates productsMap
    const idsToFetch = await this.getProductIdsToFetch<ProductEntity>({
      ids: options.ids,
      cacheType: CacheType.BaseProduct,
      onCacheHit: (id, product) => {
        productsMap.set(id, product);
      },
      bypassCache: options.bypassCache,
    });

    // Get Products that are not in cache, then store them in cache.
    if (idsToFetch.length > 0) {
      const result = await this.productRepository.findByIds2(
        { ids: idsToFetch },
        ctx,
      );

      for (const product of result) {
        productsMap.set(product.id, product);

        // Add product to the cache.
        const cacheKey = `${product.id}`;
        await this.cacheService.setCached(product, {
          type: CacheType.BaseProduct,
          key: cacheKey,
          bypass: options.bypassCache,
        });
      }
    }

    const products = [...productsMap.values()].filter((val) => val != null);

    // Check if we have products
    if (products.length === 0) {
      return [];
    }

    // Populate Related
    await this.populateRelated({ ...options, products }, ctx);

    // Do the rest simultaneously
    await Promise.all([
      this.populateFields({ ...options, products }, ctx),
      this.populateRanks({ ...options, products }, ctx),
      this.populateBenchmarks({ ...options, products }, ctx),
      this.populateGameFps({ ...options, products }, ctx),
      this.populateImages({ ...options, products }, ctx),
      this.populateSources({ ...options, products }, ctx),
    ]);
    // await concurrent(
    //   [
    //     () => this.populateFields({ ...options, products }, ctx),
    //     () => this.populateRanks({ ...options, products }, ctx),
    //     () => this.populateBenchmarks({ ...options, products }, ctx),
    //     () => this.populateGameFps({ ...options, products }, ctx),
    //     () => this.populateImages({ ...options, products }, ctx),
    //     () => this.populateSources({ ...options, products }, ctx),
    //   ],
    //   { limit: 3 },
    // );

    return products;
  }

  async getProductBySlug(options: GetProductBySlugOptions, ctx: Context) {
    // TODO: cache slug -> id?
    const productId = await this.productRepository.findIdBySlug(
      { productType: options.productType, slug: options.slug },
      ctx,
    );

    if (productId == null) {
      return null;
    }

    const result = await this.getProductById(
      { ...options, id: productId },
      ctx,
    );
    return result;
  }

  async invalidate(options: InvalidateOptions) {
    const key = `${options.id}`;
    await this.cacheService.invalidate({ type: CacheType.BaseProduct, key });
    await this.cacheService.invalidate({ type: CacheType.ProductFields, key });
    await this.cacheService.invalidate({
      type: CacheType.ProductBenchmarks,
      key,
    });
    await this.cacheService.invalidate({ type: CacheType.ProductGameFps, key });
    await this.cacheService.invalidate({ type: CacheType.ProductRanks, key });
    await this.cacheService.invalidate({ type: CacheType.ProductImages, key });
    await this.cacheService.invalidate({ type: CacheType.ProductSources, key });
    await this.cacheService.invalidate({
      type: CacheType.RelatedProducts,
      key,
    });
  }

  private async populateRelated(options: PopulateOptions, ctx: Context) {
    if (!options.includeRelated) {
      return;
    }

    const products = options.products;
    const productMap = this.getProductMap({
      products,
      base: true,
    });

    const relatedProductIdsSet = new Set<number>();

    // IDs of products that that don't have cached related products.
    const idsToFetch = await this.getProductIdsToFetch<RelatedProductEntity[]>({
      products,
      base: true,
      cacheType: CacheType.RelatedProducts,
      onCacheHit: (id, data) => {
        if (productMap[id] == null) {
          return;
        }

        productMap[id].relatedProducts = data;
        for (const entity of data) {
          relatedProductIdsSet.add(entity.relatedProductId);
        }
      },
      bypassCache: options.bypassCache,
    });

    // Get Related Products that are not in cache, then store them in cache.
    if (idsToFetch.length > 0) {
      const result = await this.relatedProductRepository.findByProductIds(
        { productIds: idsToFetch },
        ctx,
      );

      const relatedGroupsMap = new Map<number, RelatedProductEntity[]>();
      for (const related of result) {
        if (!relatedGroupsMap.has(related.productId)) {
          relatedGroupsMap.set(related.productId, []);
        }

        relatedGroupsMap.get(related.productId).push(related);
        relatedProductIdsSet.add(related.relatedProductId);
      }

      // Add related products to cache
      for (const relatedGroup of relatedGroupsMap) {
        const [productId, related] = relatedGroup;
        // Populate the base or parent products.
        productMap[productId].relatedProducts = related;

        const cacheKey = `${productId}`;
        await this.cacheService.setCached(related, {
          type: CacheType.RelatedProducts,
          key: cacheKey,
          bypass: options.bypassCache,
        });
      }
    }

    // Populate product entity on each related product
    const relatedProductIds: number[] = [...relatedProductIdsSet.values()];
    const entities = await this.getProductsByIds(
      { ids: relatedProductIds, bypassCache: options.bypassCache },
      ctx,
    );
    const entityMap = entities.reduce((acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    }, {} as Record<number, ProductEntity>);
    for (const product of Object.values(productMap)) {
      const relatedProducts = product.relatedProducts ?? [];
      for (const entity of relatedProducts) {
        entity.relatedProduct = entityMap[entity.relatedProductId];
      }
    }
  }

  private async populateFields(options: PopulateOptions, ctx: Context) {
    if (!options.includeBaseFields && !options.includeRelatedFields) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseFields,
      related: options.includeRelatedFields,
    });

    const idsToFetch = await this.getProductIdsToFetch<
      CpuFieldsEntity | GpuFieldsEntity
    >({
      products,
      base: options.includeBaseFields,
      related: options.includeRelatedFields,
      cacheType: CacheType.ProductFields,
      onCacheHit: (id: number, data) => {
        if (productMap[id] == null) {
          return;
        }

        const productType = productMap[id].productType;
        if (productType === ProductType.Cpu) {
          productMap[id].cpuFields = data as CpuFieldsEntity;
        } else if (productType === ProductType.Gpu) {
          productMap[id].gpuFields = data as GpuFieldsEntity;
        }
      },
      bypassCache: options.bypassCache,
    });

    if (idsToFetch.length > 0) {
      // Get fields that are not in cache, then store them in cache.
      // Also add them to the products.
      const entities = await this.productFieldsRepository.findByProductIds(
        { productIds: idsToFetch },
        ctx,
      );

      // Populate fields on the products, and then cache.
      for (const entity of entities) {
        const productId = entity.productId;
        if (!productMap[productId]) {
          continue;
        }

        const productType = productMap[productId]?.productType;
        if (productType === ProductType.Cpu) {
          productMap[productId].cpuFields = entity as CpuFieldsEntity;
        } else if (productType === ProductType.Gpu) {
          productMap[productId].gpuFields = entity as GpuFieldsEntity;
        }

        await this.cacheService.setCached(entity, {
          type: CacheType.ProductFields,
          key: `${productId}`,
          bypass: options.bypassCache,
        });
      }
    }
  }

  private async populateBenchmarks(options: PopulateOptions, ctx: Context) {
    if (!options.includeBaseBenchmarks && !options.includeRelatedBenchmarks) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseBenchmarks,
      related: options.includeRelatedBenchmarks,
    });

    const idsToFetch = await this.getProductIdsToFetch<
      ProductBenchmarkEntity[]
    >({
      products,
      base: options.includeBaseBenchmarks,
      related: options.includeRelatedBenchmarks,
      cacheType: CacheType.ProductBenchmarks,
      onCacheHit: (id: number, data) => {
        if (productMap[id] == null) {
          return;
        }

        productMap[id].benchmarks = data;
      },
      bypassCache: options.bypassCache,
    });

    if (idsToFetch.length > 0) {
      // Get benchmarks that are not in cache, then store them in cache.
      // Also add them to the products.
      const entities = await this.productBenchmarkRepository.findByProductIds(
        { productIds: idsToFetch },
        ctx,
      );
      const entityGroups = entities.reduce((acc, entity) => {
        acc[entity.productId] = acc[entity.productId] || [];
        acc[entity.productId].push(entity);
        return acc;
      }, {} as Record<number, ProductBenchmarkEntity[]>);

      // Populate benchmarks on the products and cache them.
      for (const id of idsToFetch) {
        const benchmarks = entityGroups[id] || [];
        if (productMap[id]) {
          productMap[id].benchmarks = benchmarks;
        }

        await this.cacheService.setCached(benchmarks, {
          type: CacheType.ProductBenchmarks,
          key: `${id}`,
          bypass: options.bypassCache,
        });
      }
    }
  }

  private async populateGameFps(options: PopulateOptions, ctx: Context) {
    if (!options.includeBaseGameFps && !options.includeRelatedGameFps) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseGameFps,
      related: options.includeRelatedGameFps,
    });

    const gameIdsSet = new Set<number>();

    const idsToFetch = await this.getProductIdsToFetch<ProductGameFpsEntity[]>({
      products,
      base: options.includeBaseGameFps,
      related: options.includeRelatedGameFps,
      cacheType: CacheType.ProductGameFps,
      onCacheHit: (id: number, data) => {
        if (productMap[id] == null) {
          return;
        }

        productMap[id].gameFps = data;
        for (const entity of data) {
          gameIdsSet.add(entity.gameId);
        }
      },
      bypassCache: options.bypassCache,
    });

    if (idsToFetch.length > 0) {
      // Get game fps that are not in cache, then store them in cache.
      // Also add them to the products.
      const entities = await this.productGameFpsRepository.findByProductIds(
        { productIds: idsToFetch },
        ctx,
      );
      const entityGroups = entities.reduce((acc, entity) => {
        acc[entity.productId] = acc[entity.productId] || [];
        acc[entity.productId].push(entity);
        return acc;
      }, {} as Record<number, ProductGameFpsEntity[]>);

      // Populate game fps on the products and cache them.
      for (const id of idsToFetch) {
        const gameFps = entityGroups[id] || [];
        if (productMap[id]) {
          productMap[id].gameFps = gameFps;
        }

        for (const value of gameFps) {
          gameIdsSet.add(value.gameId);
        }

        await this.cacheService.setCached(gameFps, {
          type: CacheType.ProductGameFps,
          key: `${id}`,
          bypass: options.bypassCache,
        });
      }
    }

    // Populate game entity on game fps
    const gameIds = [...gameIdsSet.values()];
    const games = await this.gameEntityCache.getGamesByIds(
      { ids: gameIds, bypassCache: options.bypassCache },
      ctx,
    );
    const gamesMap = games.reduce((acc, game) => {
      acc[game.id] = game;
      return acc;
    }, {} as Record<number, GameEntity>);

    for (const product of Object.values(productMap)) {
      for (const gameFps of product.gameFps ?? []) {
        gameFps.game = gamesMap[gameFps.gameId];
      }
    }
  }

  private async populateRanks(options: PopulateOptions, ctx: Context) {
    if (!options.includeBaseRanks && !options.includeRelatedRanks) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseRanks,
      related: options.includeRelatedRanks,
    });

    const idsToFetch = await this.getProductIdsToFetch<ProductRanksEntity>({
      products,
      base: options.includeBaseRanks,
      related: options.includeRelatedRanks,
      cacheType: CacheType.ProductRanks,
      onCacheHit: (id: number, data) => {
        if (productMap[id] == null) {
          return;
        }

        productMap[id].ranks = data;
      },
      bypassCache: options.bypassCache,
    });

    if (idsToFetch.length > 0) {
      // Get ranks that are not in cache, then store them in cache.
      // Also add them to the products.
      const entities = await this.productRanksRepository.findByProductIds(
        { productIds: idsToFetch },
        ctx,
      );

      // Populate ranks on the products, and then cache.
      for (const entity of entities) {
        const productId = entity.productId;
        if (productMap[productId]) {
          productMap[productId].ranks = entity;
        }

        await this.cacheService.setCached(entity, {
          type: CacheType.ProductRanks,
          key: `${productId}`,
          bypass: options.bypassCache,
        });
      }
    }
  }

  private async populateImages(options: PopulateOptions, ctx: Context) {
    if (!options.includeBaseImages && !options.includeRelatedImages) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseImages,
      related: options.includeRelatedImages,
    });

    const idsToFetch = await this.getProductIdsToFetch<ProductImageEntity[]>({
      products,
      base: options.includeBaseImages,
      related: options.includeRelatedImages,
      cacheType: CacheType.ProductImages,
      onCacheHit: (id: number, data) => {
        if (productMap[id] == null) {
          return;
        }

        productMap[id].images = data;
      },
      bypassCache: options.bypassCache,
    });

    if (idsToFetch.length > 0) {
      // Get images that are not in cache, then store them in cache.
      // Also add them to the products.
      const entities = await this.productImageRepository.findByProductIds(
        { productIds: idsToFetch },
        ctx,
      );
      const entityGroups = entities.reduce((acc, entity) => {
        acc[entity.productId] = acc[entity.productId] || [];
        acc[entity.productId].push(entity);
        return acc;
      }, {} as Record<number, ProductImageEntity[]>);

      // Populate benchmarks on the products and cache them.
      for (const id of idsToFetch) {
        const images = entityGroups[id] || [];
        if (productMap[id]) {
          productMap[id].images = images;
        }

        await this.cacheService.setCached(images, {
          type: CacheType.ProductImages,
          key: `${id}`,
          bypass: options.bypassCache,
        });
      }
    }
  }

  private async populateSources(options: PopulateOptions, ctx: Context) {
    if (!options.includeBaseSources && !options.includeRelatedSources) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseSources,
      related: options.includeRelatedSources,
    });

    const idsToFetch = await this.getProductIdsToFetch<ProductSourceEntity[]>({
      products,
      base: options.includeBaseSources,
      related: options.includeRelatedSources,
      cacheType: CacheType.ProductSources,
      onCacheHit: (id: number, data) => {
        if (productMap[id] == null) {
          return;
        }

        productMap[id].sources = data;
      },
      bypassCache: options.bypassCache,
    });

    if (idsToFetch.length > 0) {
      // Get sources that are not in cache, then store them in cache.
      // Also add them to the products.
      const entities = await this.productSourceRepository.findByProductIds(
        { productIds: idsToFetch },
        ctx,
      );
      const entityGroups = entities.reduce((acc, entity) => {
        acc[entity.productId] = acc[entity.productId] || [];
        acc[entity.productId].push(entity);
        return acc;
      }, {} as Record<number, ProductSourceEntity[]>);

      // Populate sources on the products and cache them.
      for (const id of idsToFetch) {
        const sources = entityGroups[id] || [];
        if (productMap[id]) {
          productMap[id].sources = sources;
        }

        await this.cacheService.setCached(sources, {
          type: CacheType.ProductSources,
          key: `${id}`,
          bypass: options.bypassCache,
        });
      }
    }
  }

  /**
   * Utility method to get all the relevant product IDs
   * in the products paramter.
   *
   * We can limit to the base products, the parents, or the related products.
   */
  private getProductIds(options: GetProductIdsOptions) {
    const { products } = options;

    const includeBase = options.base ?? false;
    const includeRelated = options.related ?? false;

    const productIdsSet = new Set<number>();
    for (const product of products) {
      if (includeBase) {
        productIdsSet.add(product.id);
      }
      if (includeRelated && product.relatedProducts) {
        for (const related of product.relatedProducts) {
          productIdsSet.add(related.relatedProductId);
        }
      }
    }

    return [...productIdsSet.values()];
  }

  private getProductMap(options: GetProductMapOptions) {
    const { products } = options;

    const includeBase = options.base ?? false;
    const includeRelated = options.related ?? false;

    const map: Record<number, ProductEntity> = {};
    for (const product of products) {
      if (includeBase) {
        map[product.id] = product;
      }

      if (includeRelated && product.relatedProducts) {
        for (const related of product.relatedProducts) {
          map[related.relatedProductId] = related.relatedProduct;
        }
      }
    }

    return map;
  }

  private async getProductIdsToFetch<TData = unknown>(
    options: GetProductIdsToFetchOptions<TData>,
  ) {
    const products = options.products;
    const cacheType = options.cacheType;
    const bypassCache = options.bypassCache;

    let productIds: number[] = [];
    if (options.products != null) {
      productIds = this.getProductIds({
        products,
        base: options.base,
        related: options.related,
      });
    } else if (options.ids != null) {
      productIds = options.ids;
    }

    const idsToFetchSet = new Set<number>(productIds);

    for (const id of idsToFetchSet) {
      const cacheKey = `${id}`;
      // TODO: use mget?
      const value = await this.cacheService.getCached({
        type: cacheType,
        key: cacheKey,
        shallowClone: true,
        bypass: bypassCache,
      });

      // If we found data in the cache, then call the onCacheHit function
      // and remove the id from the ones that need to be fetched from the database.
      if (value != null) {
        if (options.onCacheHit) {
          options.onCacheHit(id, value as TData);
        }
        idsToFetchSet.delete(id);
      }
    }

    return [...idsToFetchSet.values()];
  }
}
