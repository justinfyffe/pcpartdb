import { Injectable } from '@nestjs/common';
import {
  BenchmarkKey,
  concurrent,
  getHighestAvailableSettingsPreset,
  getProductGame,
  getProductGameCpfValue,
  getProductGameFpsPerDollarValue,
  getProductGameFpsValue,
  GetRelativeDataProductsRequest,
  ListSort,
  Product,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductComparison,
  ProductType,
  RelativeDataProducts,
  RelativeDataType,
  SettingsPresetKey,
} from '@pcpartdb/shared';
import { CacheService, CacheType } from '../shared/cache/cache.service';
import { Context } from '../shared/context';
import { getSurroundingValues } from '../shared/utils';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories';

const DEFAULT_TOTAL = 10;

interface BuildRelativeDataProductsOptions {
  products: Partial<Product>[];

  benchmark?: BenchmarkKey;
  game?: number | string;

  total?: number;

  bypassCache?: boolean;
}

type BuildProductsListOptions =
  | {
      seeds: Partial<Product>[];
      type: RelativeDataType;
      total?: number;
    } & (
      | {
          type: RelativeDataType.BenchmarkPerformance;
          benchmark: BenchmarkKey;
        }
      | {
          type: RelativeDataType.BenchmarkPerformancePerDollar;
          benchmark: BenchmarkKey;
        }
      | {
          type: RelativeDataType.GameFps;
          game: number | string; // Game ID or Slug
          settingsPreset: SettingsPresetKey;
        }
      | {
          type: RelativeDataType.GameCpf;
          game: number | string; // Game ID or Slug
          settingsPreset: SettingsPresetKey;
        }
      | {
          type: RelativeDataType.GameFpsPerDollar;
          game: number | string; // Game ID or Slug
          settingsPreset: SettingsPresetKey;
        }
    );

interface BuildRelatedProductsOptions {
  total: number;
  relativeDataProducts: RelativeDataProducts;
  excludeIds?: number[];
}

interface BuildRelatedComparisonsOptions {
  total: number;
  relativeDataProducts: RelativeDataProducts;
  excludeIds?: number[];
}

interface ConcatProductNeighborsOptions {
  comparison: ProductComparison;
  neighbors1: Partial<Product>[];
  neighbors2: Partial<Product>[];
  compareFn: (product1: Partial<Product>, product2: Partial<Product>) => number;
  total?: number;
}

interface MergeProductNeighborsOptions {
  comparison: ProductComparison;
  neighbors1: Partial<Product>[];
  neighbors2: Partial<Product>[];
  compareFn: (product1: Partial<Product>, product2: Partial<Product>) => number;
  total?: number;
}

interface GetBestBenchmarkPerformanceOptions {
  productType: ProductType;
  benchmark: BenchmarkKey;
  bypassCache?: boolean;
}

interface GetBestBenchmarkPerformancePerDollarOptions {
  productType: ProductType;
  benchmark: BenchmarkKey;
  bypassCache?: boolean;
}

@Injectable()
export class RelativeDataProductsService {
  constructor(
    private productService: ProductService,
    private productRepository: ProductRepository,
    private cacheService: CacheService,
  ) {}

  async getRelativeDataProducts(
    request: GetRelativeDataProductsRequest,
    ctx: Context,
  ) {
    const { productIds, benchmark, game, bypassCache } = request;

    const products: Partial<Product>[] = await Promise.all(
      productIds.map((productId) =>
        this.productService.getById(
          {
            id: productId,

            includeRelated: true,

            includeBenchmarks: true,
            includeRelatedBenchmarks: benchmark ? [benchmark] : false,

            includeGames: true,
            includeRelatedGames: game ? [game] : false,

            includeRanks: true,

            bypassCache,
          },
          ctx,
        ),
      ),
    );

    return this.buildRelativeDataProducts(
      {
        products,
        benchmark: request.benchmark,
        game: request.game,
        total: request.total,
        bypassCache,
      },
      ctx,
    );
  }

  async buildRelativeDataProducts(
    options: BuildRelativeDataProductsOptions,
    ctx: Context,
  ) {
    const relative: RelativeDataProducts = {};
    if (options.benchmark) {
      relative.benchmarkPerformance = this.buildProductsList({
        type: RelativeDataType.BenchmarkPerformance,
        seeds: options.products,
        benchmark: options.benchmark,
      });
      relative.benchmarkPerformancePerDollar = this.buildProductsList({
        type: RelativeDataType.BenchmarkPerformancePerDollar,
        seeds: options.products,
        benchmark: options.benchmark,
      });

      const [bestBenchmarkPerformance, bestBenchmarkPerformancePerDollar] =
        await Promise.all([
          this.getBestBenchmarkPerformance(
            {
              productType: options.products[0].productType,
              benchmark: options.benchmark,
              bypassCache: options.bypassCache,
            },
            ctx,
          ),
          this.getBestBenchmarkPerformancePerDollar(
            {
              productType: options.products[0].productType,
              benchmark: options.benchmark,
              bypassCache: options.bypassCache,
            },
            ctx,
          ),
        ]);

      relative.bestBenchmarkPerformance = bestBenchmarkPerformance;
      relative.bestBenchmarkPerformancePerDollar =
        bestBenchmarkPerformancePerDollar;
    }

    if (options.game) {
      // Relative data products will be based on highest
      // available settings preset.
      const settingsPreset = getHighestAvailableSettingsPreset(
        options.products.map((p) => getProductGame(p, options.game)),
      );

      relative.gameFps = this.buildProductsList({
        type: RelativeDataType.GameFps,
        seeds: options.products,
        game: options.game,
        settingsPreset,
      });
      relative.gameCpf = this.buildProductsList({
        type: RelativeDataType.GameCpf,
        seeds: options.products,
        game: options.game,
        settingsPreset,
      });
      // relative.gameFpsPerDollar = this.buildProductsList({
      //   type: RelativeDataType.GameFpsPerDollar,
      //   seeds: options.products,
      //   game: options.game,
      //   settingsPreset,
      // });
    }

    return relative;
  }

  buildRelatedProducts(options: BuildRelatedProductsOptions) {
    const { total, relativeDataProducts, excludeIds } = options;

    const map: Record<number, Partial<Product>> = {};
    for (const relativeProducts of Object.values(relativeDataProducts)) {
      if (Array.isArray(relativeProducts)) {
        for (const relativeProduct of relativeProducts) {
          map[relativeProduct.id] = relativeProduct;
        }
      }
    }
    const productIds = Object.keys(map).map((val) => Number(val));

    const set = new Set(productIds);
    for (const id of excludeIds ?? []) {
      set.delete(id);
    }

    const related: Partial<Product>[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      const product = map[id];
      related.push(product);
    }

    return related;
  }

  buildRelatedComparisons(options: BuildRelatedComparisonsOptions) {
    const { total, relativeDataProducts, excludeIds } = options;

    const map: Record<number, Partial<Product>> = {};
    for (const relativeProducts of Object.values(relativeDataProducts)) {
      if (Array.isArray(relativeProducts)) {
        for (const relativeProduct of relativeProducts) {
          map[relativeProduct.id] = relativeProduct;
        }
      }
    }
    const productIds = Object.keys(map).map((val) => Number(val));

    const set = new Set(productIds);
    for (const id of excludeIds ?? []) {
      set.delete(id);
    }

    const comparisons: ProductComparison[] = [];
    for (let i = 0; i < total && set.size > 1; ++i) {
      const randIdx1 = Math.floor(Math.random() * set.size);
      const id1 = [...set.values()][randIdx1];
      set.delete(id1);
      const randIdx2 = Math.floor(Math.random() * set.size);
      const id2 = [...set.values()][randIdx2];
      set.delete(id2);

      const product1 = map[id1];
      const product2 = map[id2];
      comparisons.push([product1, product2]);
    }

    return comparisons;
  }

  private buildProductsList(options: BuildProductsListOptions) {
    const { seeds } = options;

    if (seeds.length > 1) {
      return this.buildProductsListForComparison(options);
    }

    const [seed] = seeds;

    // TODO: add memoization if performance is bad
    let sortFunc: (
      product1: Partial<Product>,
      product2: Partial<Product>,
    ) => number;
    let valueFunc: (product: Partial<Product>) => number;
    if (options.type === RelativeDataType.BenchmarkPerformance) {
      valueFunc = (product: Partial<Product>) =>
        productBenchmarkValue(product, options.benchmark);
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    } else if (
      options.type === RelativeDataType.BenchmarkPerformancePerDollar
    ) {
      valueFunc = (product: Partial<Product>) =>
        productBenchmarkValuePerMsrp(product, options.benchmark);
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    } else if (options.type === RelativeDataType.GameFps) {
      valueFunc = (product: Partial<Product>) => {
        const pg = getProductGame(product, options.game);
        return getProductGameFpsValue(pg, options.settingsPreset);
      };
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    } else if (options.type === RelativeDataType.GameCpf) {
      valueFunc = (product: Partial<Product>) => {
        const pg = getProductGame(product, options.game);
        return getProductGameCpfValue(pg, options.settingsPreset);
      };
      sortFunc = (p1, p2) => valueFunc(p1) - valueFunc(p2);
    } else if (options.type === RelativeDataType.GameFpsPerDollar) {
      valueFunc = (product: Partial<Product>) => {
        const pg = getProductGame(product, options.game);
        return getProductGameFpsPerDollarValue(pg, options.settingsPreset);
      };
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    }

    // Missing data. Cannot have neighbors.
    if (valueFunc(seed) == null) {
      return [];
    }

    const relative =
      ([seed, ...seed.relatedProducts]
        ?.filter((p) => valueFunc(p) != null)
        .sort(sortFunc) as Partial<Product>[]) ?? [];

    return getSurroundingValues(
      relative,
      relative.findIndex((gpu) => gpu.id === seed.id),
      options.total ?? DEFAULT_TOTAL,
    ).sort(sortFunc);
  }

  private buildProductsListForComparison(options: BuildProductsListOptions) {
    const { seeds } = options;
    const [seed1, seed2] = seeds;

    // TODO: add memoization if performance is bad
    let sortFunc: (
      product1: Partial<Product>,
      product2: Partial<Product>,
    ) => number;
    let valueFunc: (product: Partial<Product>) => number;
    if (options.type === RelativeDataType.BenchmarkPerformance) {
      valueFunc = (product: Partial<Product>) =>
        productBenchmarkValue(product, options.benchmark);
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    } else if (
      options.type === RelativeDataType.BenchmarkPerformancePerDollar
    ) {
      valueFunc = (product: Partial<Product>) =>
        productBenchmarkValuePerMsrp(product, options.benchmark);
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    } else if (options.type === RelativeDataType.GameFps) {
      valueFunc = (product: Partial<Product>) => {
        const pg = getProductGame(product, options.game);
        return getProductGameFpsValue(pg, options.settingsPreset);
      };
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    } else if (options.type === RelativeDataType.GameCpf) {
      valueFunc = (product: Partial<Product>) => {
        const pg = getProductGame(product, options.game);
        return getProductGameCpfValue(pg, options.settingsPreset);
      };
      sortFunc = (p1, p2) => valueFunc(p1) - valueFunc(p2);
    } else if (options.type === RelativeDataType.GameFpsPerDollar) {
      valueFunc = (product: Partial<Product>) => {
        const pg = getProductGame(product, options.game);
        return getProductGameFpsPerDollarValue(pg, options.settingsPreset);
      };
      sortFunc = (p1, p2) => valueFunc(p2) - valueFunc(p1);
    }

    // Missing data. Cannot have neighbors.
    if (valueFunc(seed1) == null && valueFunc(seed2) == null) {
      return [];
    }

    const relative1 =
      valueFunc(seed1) != null
        ? ([seed1, ...seed1.relatedProducts]
            .filter((p) => valueFunc(p) != null)
            .sort(sortFunc) as Partial<Product>[])
        : [];
    const relative2 = valueFunc(seed2)
      ? ([seed2, ...seed2.relatedProducts]
          .filter((p) => valueFunc(p) != null)
          .sort(sortFunc) as Partial<Product>[])
      : [];

    if (relative1.length === 0 && relative2.length === 0) {
      return [];
    }

    if (relative1.length === 0 || relative2.length === 0) {
      const neighbors = [...relative1, ...relative2].sort(sortFunc);
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex(
          (product) => product.id === seed1.id || product.id === seed2.id,
        ),
        options.total ?? DEFAULT_TOTAL,
      );
    }

    // Check if they should merge.
    const neighbors1 = getSurroundingValues(
      relative1,
      relative1.findIndex((product) => product.id === seed1.id),
      options.total ?? DEFAULT_TOTAL,
    );
    const neighbors2 = getSurroundingValues(
      relative2,
      relative2.findIndex((product) => product.id === seed2.id),
      options.total ?? DEFAULT_TOTAL,
    );
    const shouldMerge =
      neighbors1.find((p) => p.id === seed2.id) ||
      neighbors2.find((p) => p.id === seed1.id);

    if (shouldMerge) {
      return this.mergeProductNeighbors({
        comparison: [seed1, seed2],
        neighbors1,
        neighbors2,
        compareFn: sortFunc,
        total: options.total,
      });
    } else {
      return this.concatProductNeighbors({
        comparison: [seed1, seed2],
        neighbors1,
        neighbors2,
        compareFn: sortFunc,
        total: options.total,
      });
    }
  }

  private concatProductNeighbors(options: ConcatProductNeighborsOptions) {
    const { comparison, neighbors1, neighbors2, compareFn } = options;
    const [gpu1, gpu2] = comparison;
    const total = options.total ?? DEFAULT_TOTAL;

    // Get the nearest neighbors for both GPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((product) => product.id === gpu1.id),
      total / 2,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((product) => product.id === gpu2.id),
      total / 2,
    );

    // Combine them and sort.
    const set = [...surrounding1, ...surrounding2].reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, Partial<Product>>);
    return Object.values(set).sort(compareFn);
  }

  private mergeProductNeighbors(options: MergeProductNeighborsOptions) {
    const { comparison, neighbors1, neighbors2, compareFn } = options;
    const [gpu1, gpu2] = comparison;
    const total = options.total ?? DEFAULT_TOTAL;

    // Get the nearest neighbors for both GPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((product) => product.id === gpu1.id),
      total,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((product) => product.id === gpu2.id),
      total,
    );

    // Combine the nearest neighbors. Factor in that they may overlap.
    const set = [...surrounding1, ...surrounding2].reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, Partial<Product>>);
    const merged = Object.values(set).sort(compareFn);

    // Find the middle point between the two GPUs that are being compared.
    const idx1 = merged.findIndex((gpu) => gpu.id === gpu1.id);
    const idx2 = merged.findIndex((gpu) => gpu.id === gpu2.id);
    const pivot = Math.ceil((idx1 + idx2) / 2);

    // Find the GPUs surrounding the middle point.
    return getSurroundingValues(merged, pivot, total);
  }

  private async getBestBenchmarkPerformance(
    options: GetBestBenchmarkPerformanceOptions,
    ctx: Context,
  ) {
    const { productType, benchmark } = options;
    const cacheKey = `benchmarkPerformance__${productType.toLowerCase()}__${benchmark.toLowerCase()}`;

    const bestProductId = await this.cacheService.cache(
      async () => {
        const bestProductId = await this.productRepository.findBestProductId(
          { benchmark, sort: ListSort.PerformanceRating },
          ctx,
        );
        return bestProductId;
      },
      {
        type: CacheType.BestProduct,
        key: cacheKey,
        excludeFromMaxItems: false,
      },
    );

    const product = await this.productService.getById(
      {
        id: bestProductId,
        includeBenchmarks: [benchmark],
        includeRanks: [benchmark],
        bypassCache: options.bypassCache,
      },
      ctx,
    );
    return product;
  }

  private async getBestBenchmarkPerformancePerDollar(
    options: GetBestBenchmarkPerformancePerDollarOptions,
    ctx: Context,
  ) {
    const { productType, benchmark } = options;
    const cacheKey = `benchmarkPerformancePerMsrp__${productType.toLowerCase()}__${benchmark.toLowerCase()}`;

    const bestProductId = await this.cacheService.cache(
      async () => {
        const bestProductId = await this.productRepository.findBestProductId(
          {
            benchmark,
            sort: ListSort.PerformancePerMsrp,
          },
          ctx,
        );
        return bestProductId;
      },
      {
        type: CacheType.BestProduct,
        key: cacheKey,
        excludeFromMaxItems: false,
      },
    );

    const product = await this.productService.getById(
      {
        id: bestProductId,
        includeBenchmarks: [benchmark],
        includeRanks: [benchmark],
        bypassCache: options.bypassCache,
      },
      ctx,
    );
    return product;
  }
}
