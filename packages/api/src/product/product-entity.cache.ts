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
import { randomUUID } from 'crypto';
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
  includeParents?: boolean;
  includeChildren?: boolean;
  includeRelated?: boolean;

  includeBaseFields?: boolean;
  includeParentFields?: boolean;
  includeChildrenFields?: boolean;
  includeRelatedFields?: boolean;

  includeBaseBenchmarks?: boolean;
  includeParentBenchmarks?: boolean;
  includeRelatedBenchmarks?: boolean;

  includeBaseGameFps?: boolean;
  includeParentGameFps?: boolean;
  includeRelatedGameFps?: boolean;

  includeBaseRanks?: boolean;
  includeParentRanks?: boolean;
  includeRelatedRanks?: boolean;

  includeBaseImages?: boolean;
  includeParentImages?: boolean;
  includeRelatedImages?: boolean;

  includeBaseSources?: boolean;
  includeParentSources?: boolean;
  includeRelatedSources?: boolean;
}

interface PopulateOptions extends RelationOptions {
  products: ProductEntity[];
  bypassCache?: boolean;
}

interface GetProductIdsOptions {
  products: ProductEntity[];
  base?: boolean;
  parents?: boolean;
  children?: boolean;
  related?: boolean;
}

interface GetProductMapOptions {
  products: ProductEntity[];
  base?: boolean;
  parents?: boolean;
  children?: boolean;
  related?: boolean;
}

interface GetProductIdsToFetchOptions<TData = unknown> {
  // One or the other
  ids?: number[];
  products?: ProductEntity[];

  base?: boolean;
  parents?: boolean;
  children?: boolean;
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

    // Populate Parents
    await this.populateParents({ ...options, products }, ctx);

    // Populate Children and Related
    await Promise.all([
      this.populateChildren({ ...options, products }, ctx),
      this.populateRelated({ ...options, products }, ctx),
    ]);

    // Do the rest simultaneously
    await concurrent(
      [
        () => this.populateFields({ ...options, products }, ctx),
        () => this.populateRanks({ ...options, products }, ctx),
        () => this.populateBenchmarks({ ...options, products }, ctx),
        () => this.populateGameFps({ ...options, products }, ctx),
        () => this.populateImages({ ...options, products }, ctx),
        () => this.populateSources({ ...options, products }, ctx),
      ],
      { limit: 3 },
    );

    return products;
  }

  async getProductBySlug(options: GetProductBySlugOptions, ctx: Context) {
    // TODO: cache slug -> id?
    const product = await this.productRepository.findBySlug2(
      { productType: options.productType, slug: options.slug },
      ctx,
    );

    if (product == null) {
      return null;
    }

    const result = await this.getProductById(
      { ...options, id: product.id },
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
      type: CacheType.ChildrenProductIds,
      key,
    });
    await this.cacheService.invalidate({
      type: CacheType.RelatedProducts,
      key,
    });
  }

  private async populateParents(options: PopulateOptions, ctx: Context) {
    if (!options.includeParents) {
      return;
    }

    const products = options.products;
    const parentIds = this.getProductIds({ products, parents: true });
    const parents = await this.getProductsByIds({ ids: parentIds }, ctx);

    const parentMap = parents.reduce((acc, parent) => {
      acc[parent.id] = parent;
      return acc;
    }, {} as Record<number, ProductEntity>);

    for (const product of products) {
      if (product.parentId != null) {
        product.parent = parentMap[product.parentId];
      }
    }
  }

  private async populateChildren(options: PopulateOptions, ctx: Context) {
    if (!options.includeChildren) {
      return;
    }

    const products = options.products;

    // We don't want children for related.
    const productMap = this.getProductMap({
      products,
      base: true,
      parents: true,
    });

    const childrenToPopulate = Object.values(productMap).reduce(
      (acc, product) => {
        acc[product.id] = [];
        return acc;
      },
      {} as Record<number, number[]>,
    );

    // IDs of products that that don't have cached related products.
    const idsToFetch = await this.getProductIdsToFetch<number[]>({
      products,
      base: true,
      parents: true,
      cacheType: CacheType.ChildrenProductIds,
      onCacheHit: (id, data) => {
        childrenToPopulate[id] = data;
      },
      bypassCache: options.bypassCache,
    });

    // Fetch children ids not in cache from the database. Add them to cache.
    if (idsToFetch.length > 0) {
      const results = await this.productRepository.findChildrenIds(
        { ids: idsToFetch },
        ctx,
      );
      const resultsMap = results.reduce((acc, result) => {
        acc[result.parentId] = acc[result.parentId] || [];
        acc[result.parentId].push(result.id);
        return acc;
      }, {} as Record<number, number[]>);
      for (const id of idsToFetch) {
        childrenToPopulate[id] = resultsMap[id] ?? [];
        await this.cacheService.setCached(childrenToPopulate[id], {
          type: CacheType.ChildrenProductIds,
          key: `${id}`,
          bypass: options.bypassCache,
        });
      }
    }

    // Populate product entities for children
    for (const product of Object.values(productMap)) {
      const childrenIds = childrenToPopulate[product.id];
      if (!childrenIds) {
        continue;
      }

      const children = await this.getProductsByIds(
        { ids: childrenIds, bypassCache: options.bypassCache },
        ctx,
      );
      product.children = children;
    }
  }

  private async populateRelated(options: PopulateOptions, ctx: Context) {
    if (!options.includeRelated) {
      return;
    }

    const products = options.products;
    const productMap = this.getProductMap({
      products,
      base: true,
      parents: true,
    });

    const relatedProductIdsSet = new Set<number>();

    // IDs of products that that don't have cached related products.
    const idsToFetch = await this.getProductIdsToFetch<RelatedProductEntity[]>({
      products,
      base: true,
      parents: true,
      cacheType: CacheType.RelatedProducts,
      onCacheHit: (id, data) => {
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
    if (
      !options.includeBaseFields &&
      !options.includeParentFields &&
      !options.includeChildrenFields &&
      !options.includeRelatedFields
    ) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseFields,
      parents: options.includeParentFields,
      children: options.includeChildrenFields,
      related: options.includeRelatedFields,
    });

    const idsToFetch = await this.getProductIdsToFetch<
      CpuFieldsEntity | GpuFieldsEntity
    >({
      products,
      base: options.includeBaseFields,
      parents: options.includeParentFields,
      children: options.includeChildrenFields,
      related: options.includeRelatedFields,
      cacheType: CacheType.ProductFields,
      onCacheHit: (id: number, data) => {
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
    if (
      !options.includeBaseBenchmarks &&
      !options.includeParentBenchmarks &&
      !options.includeRelatedBenchmarks
    ) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseBenchmarks,
      parents: options.includeParentBenchmarks,
      related: options.includeRelatedBenchmarks,
    });

    const idsToFetch = await this.getProductIdsToFetch<
      ProductBenchmarkEntity[]
    >({
      products,
      base: options.includeBaseBenchmarks,
      parents: options.includeParentBenchmarks,
      related: options.includeRelatedBenchmarks,
      cacheType: CacheType.ProductBenchmarks,
      onCacheHit: (id: number, data) => {
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
    if (
      !options.includeBaseGameFps &&
      !options.includeParentGameFps &&
      !options.includeRelatedGameFps
    ) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseGameFps,
      parents: options.includeParentGameFps,
      related: options.includeRelatedGameFps,
    });

    const gameIdsSet = new Set<number>();

    const idsToFetch = await this.getProductIdsToFetch<ProductGameFpsEntity[]>({
      products,
      base: options.includeBaseGameFps,
      parents: options.includeParentGameFps,
      related: options.includeRelatedGameFps,
      cacheType: CacheType.ProductGameFps,
      onCacheHit: (id: number, data) => {
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
    if (
      !options.includeBaseRanks &&
      !options.includeParentRanks &&
      !options.includeRelatedRanks
    ) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseRanks,
      parents: options.includeParentRanks,
      related: options.includeRelatedRanks,
    });

    const idsToFetch = await this.getProductIdsToFetch<ProductRanksEntity>({
      products,
      base: options.includeBaseRanks,
      parents: options.includeParentRanks,
      related: options.includeRelatedRanks,
      cacheType: CacheType.ProductRanks,
      onCacheHit: (id: number, data) => {
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
    if (
      !options.includeBaseImages &&
      !options.includeParentImages &&
      !options.includeRelatedImages
    ) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseImages,
      parents: options.includeParentImages,
      related: options.includeRelatedImages,
    });

    const idsToFetch = await this.getProductIdsToFetch<ProductImageEntity[]>({
      products,
      base: options.includeBaseImages,
      parents: options.includeParentImages,
      related: options.includeRelatedImages,
      cacheType: CacheType.ProductImages,
      onCacheHit: (id: number, data) => {
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
    if (
      !options.includeBaseSources &&
      !options.includeParentSources &&
      !options.includeRelatedSources
    ) {
      return;
    }

    const { products } = options;

    const productMap = this.getProductMap({
      products,
      base: options.includeBaseSources,
      parents: options.includeParentSources,
      related: options.includeRelatedSources,
    });

    const idsToFetch = await this.getProductIdsToFetch<ProductSourceEntity[]>({
      products,
      base: options.includeBaseSources,
      parents: options.includeParentSources,
      related: options.includeRelatedSources,
      cacheType: CacheType.ProductSources,
      onCacheHit: (id: number, data) => {
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
    const includeParents = options.parents ?? false;
    const includeChildren = options.children ?? false;
    const includeRelated = options.related ?? false;

    const productIdsSet = new Set<number>();
    for (const product of products) {
      if (includeBase) {
        productIdsSet.add(product.id);
      }
      if (includeParents && product.parentId) {
        productIdsSet.add(product.parentId);
      }
      if (includeChildren && product.children) {
        for (const child of product.children) {
          productIdsSet.add(child.id);
        }
      }
      if (includeRelated && product.relatedProducts) {
        for (const related of product.relatedProducts) {
          productIdsSet.add(related.relatedProductId);
        }
      }
      if (includeParents && includeRelated && product.parent?.relatedProducts) {
        for (const related of product.parent.relatedProducts) {
          productIdsSet.add(related.relatedProductId);
        }
      }
    }

    return [...productIdsSet.values()];
  }

  private getProductMap(options: GetProductMapOptions) {
    const { products } = options;

    const includeBase = options.base ?? false;
    const includeParents = options.parents ?? false;
    const includeChildren = options.children ?? false;
    const includeRelated = options.related ?? false;

    const map: Record<number, ProductEntity> = {};
    for (const product of products) {
      if (includeBase) {
        map[product.id] = product;
      }
      if (includeParents && product.parent != null) {
        map[product.parentId] = product.parent;
      }
      if (includeChildren && product.children) {
        for (const child of product.children) {
          map[child.id] = child;
        }
      }
      if (includeRelated && product.relatedProducts) {
        for (const related of product.relatedProducts) {
          map[related.relatedProductId] = related.relatedProduct;
        }
      }
      if (includeParents && includeRelated && product.parent?.relatedProducts) {
        for (const related of product.parent.relatedProducts) {
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
        parents: options.parents,
        children: options.children,
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
        clone: true,
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
