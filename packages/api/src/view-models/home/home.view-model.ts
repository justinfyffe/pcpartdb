import { Injectable } from '@nestjs/common';
import {
  BenchmarkKey,
  getPreferredBenchmark,
  HomeCpuData,
  HomeGpuData,
  HomeViewModel,
  ListProductsFilter,
  ListSort,
  MarketSegment,
  ProductType,
} from '@pcpartdb/shared';
import { ProductService } from '../../product/product.service';
import { ProductRepository } from '../../product/repositories';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';

@Injectable()
export class HomeViewModelService {
  constructor(
    private productService: ProductService,
    private productRepository: ProductRepository,
    private cacheService: CacheService,
  ) {}

  async viewModel(ctx: Context) {
    const [gpuData, cpuData] = await Promise.all([
      this.getGpuData({}, ctx),
      this.getCpuData({}, ctx),
    ]);

    return {
      gpuData,
      cpuData,
    } as HomeViewModel;

    // TODO: normalize
  }

  private async getGpuData(options: { bypassCache?: boolean }, ctx: Context) {
    const { bypassCache } = options;
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Gpu,
    );

    const [performanceList, valueList, performanceComparison, valueComparison] =
      await Promise.all([
        this.getGpuPerformanceList({ benchmark, bypassCache }, ctx),
        this.getGpuValueList({ benchmark, bypassCache }, ctx),
        this.getGpuPerformanceComparison({ benchmark, bypassCache }, ctx),
        this.getGpuValueComparison({ benchmark, bypassCache }, ctx),
      ]);

    return {
      performanceList,
      valueList,
      performanceComparison,
      valueComparison,
    } as HomeGpuData;
  }

  private async getGpuPerformanceList(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    return await this.getBestProducts(
      {
        productType: ProductType.Gpu,
        benchmark,
        sort: ListSort.PerformanceRating,
        limit: 5,
        bypassCache,
      },
      ctx,
    );
  }

  private async getGpuValueList(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    return await this.getBestProducts(
      {
        productType: ProductType.Gpu,
        benchmark,
        sort: ListSort.PerformancePerMsrp,
        limit: 5,
        bypassCache,
      },
      ctx,
    );
  }

  private async getGpuPerformanceComparison(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    const [bestNvidia, bestAmd] = await Promise.all([
      this.getBestProduct(
        {
          productType: ProductType.Gpu,
          benchmark,
          company: 'nvidia',
          sort: ListSort.PerformanceRating,
          bypassCache,
        },
        ctx,
      ),
      this.getBestProduct(
        {
          productType: ProductType.Gpu,
          benchmark,
          company: 'amd',
          sort: ListSort.PerformanceRating,
          bypassCache,
        },
        ctx,
      ),
    ]);
    return [bestNvidia, bestAmd];
  }

  private async getGpuValueComparison(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    const [bestNvidia, bestAmd] = await Promise.all([
      this.getBestProduct(
        {
          productType: ProductType.Gpu,
          benchmark,
          company: 'nvidia',
          sort: ListSort.PerformancePerMsrp,
          bypassCache,
        },
        ctx,
      ),
      this.getBestProduct(
        {
          productType: ProductType.Gpu,
          benchmark,
          company: 'amd',
          sort: ListSort.PerformancePerMsrp,
          bypassCache,
        },
        ctx,
      ),
    ]);
    return [bestNvidia, bestAmd];
  }

  private async getCpuData(options: { bypassCache?: boolean }, ctx: Context) {
    const { bypassCache } = options;
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );

    const [performanceList, valueList, performanceComparison, valueComparison] =
      await Promise.all([
        this.getCpuPerformanceList({ benchmark, bypassCache }, ctx),
        this.getCpuValueList({ benchmark, bypassCache }, ctx),
        this.getCpuPerformanceComparison({ benchmark, bypassCache }, ctx),
        this.getCpuValueComparison({ benchmark, bypassCache }, ctx),
      ]);

    return {
      performanceList,
      valueList,
      performanceComparison,
      valueComparison,
    } as HomeCpuData;
  }

  private async getCpuPerformanceList(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    return await this.getBestProducts(
      {
        productType: ProductType.Cpu,
        benchmark,
        sort: ListSort.PerformanceRating,
        limit: 5,
        bypassCache,
      },
      ctx,
    );
  }

  private async getCpuValueList(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    return await this.getBestProducts(
      {
        productType: ProductType.Cpu,
        benchmark,
        sort: ListSort.PerformancePerMsrp,
        limit: 5,
        bypassCache,
      },
      ctx,
    );
  }

  private async getCpuPerformanceComparison(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    const [bestAmd, bestIntel] = await Promise.all([
      this.getBestProduct(
        {
          productType: ProductType.Cpu,
          benchmark,
          company: 'intel',
          sort: ListSort.PerformanceRating,
          bypassCache,
        },
        ctx,
      ),
      this.getBestProduct(
        {
          productType: ProductType.Cpu,
          benchmark,
          company: 'amd',
          sort: ListSort.PerformanceRating,
          bypassCache,
        },
        ctx,
      ),
    ]);
    return [bestAmd, bestIntel];
  }

  private async getCpuValueComparison(
    options: {
      benchmark: BenchmarkKey;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { benchmark, bypassCache } = options;
    const [bestAmd, bestIntel] = await Promise.all([
      this.getBestProduct(
        {
          productType: ProductType.Cpu,
          benchmark,
          company: 'intel',
          sort: ListSort.PerformancePerMsrp,
          bypassCache,
        },
        ctx,
      ),
      this.getBestProduct(
        {
          productType: ProductType.Cpu,
          benchmark,
          company: 'amd',
          sort: ListSort.PerformancePerMsrp,
          bypassCache,
        },
        ctx,
      ),
    ]);
    return [bestAmd, bestIntel];
  }

  private async getBestProduct(
    options: {
      productType: ProductType;
      benchmark: BenchmarkKey;
      company?: string;
      sort: ListSort;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const products = await this.getBestProducts({ ...options, limit: 1 }, ctx);
    return products[0];
  }

  private async getBestProducts(
    options: {
      productType: ProductType;
      benchmark: BenchmarkKey;
      company?: string;
      sort: ListSort;
      limit?: number;
      bypassCache?: boolean;
    },
    ctx: Context,
  ) {
    const { productType, benchmark, company, sort, limit } = options;
    const cacheKey = [
      sort,
      productType,
      company,
      MarketSegment.Desktop,
      benchmark,
      limit,
    ]
      .map((key) => `${key}`.toLowerCase())
      .join('__');

    const bestProductIds = await this.cacheService.cache(
      async () => {
        const bestProductIds = await this.productRepository.findBestProductIds(
          {
            productType,
            benchmark,
            sort,
            filter: {
              productType,
              segment: [MarketSegment.Desktop],
              company: company ? [company] : undefined,
            } as ListProductsFilter,
            limit,
          },
          ctx,
        );
        return bestProductIds;
      },
      {
        type: CacheType.BestProduct,
        key: cacheKey,
        excludeFromMaxItems: false,
      },
    );

    const products = await this.productService.getByIds(
      {
        ids: bestProductIds,
        bypassCache: options.bypassCache,
        includeBenchmarks: [benchmark],
      },
      ctx,
    );
    return products;
  }
}
