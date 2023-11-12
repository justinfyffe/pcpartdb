import { Injectable } from '@nestjs/common';
import {
  binarySearch,
  CompareCpusAdditionalData,
  CompareCpusViewModel,
  CpuProduct,
  CpuProductComparison,
  hasProductFieldRawValue,
  ListOrder,
  ListProductsRequest,
  ListSort,
  ProductFieldKey,
  productFieldRawValue,
  ProductRankKey,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
} from '@pcpartdb/shared';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class CompareCpusViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    console.time('CompareCpusViewModelService');
    const viewModel = await this.cacheService.cache(
      async () => {
        const comparison = await this.getComparison(slug, ctx);
        const additionalData = await this.getAdditionalData(comparison, ctx);

        const relatedCpus = await this.getRelatedCpus(
          3,
          additionalData.relativePerformanceCpus,
          additionalData.relativeValueCpus,
          comparison,
        );
        const relatedComparisons = await this.getRelatedComparisons(
          3,
          additionalData.relativePerformanceCpus,
          additionalData.relativeValueCpus,
          comparison,
        );

        return {
          comparison,
          additionalData,
          relatedCpus,
          relatedCpuComparisons: relatedComparisons,
        } as CompareCpusViewModel;
      },
      { type: CacheType.CpuComparison, key: `viewModel__${slug}` },
    );
    console.timeEnd('CompareCpusViewModelService');

    return viewModel;
  }

  private async getComparison(slug: string, ctx: Context) {
    const comparison = await this.db.transaction(
      () =>
        this.productService.getComparison(
          {
            productType: ProductType.Cpu,
            slug,

            includeParent: true,
            includeChildren: false,
            includeAutomation: false,
            includeBenchmarks: true,
            includeImages: true,
            includeSources: false,
            includeUpdates: false,

            includeRanks: [
              'performanceRating',
              'performancePerMsrp',
            ] as ProductRankKey[],
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return comparison as CpuProductComparison;
  }

  private async getAdditionalData(
    comparison: CpuProductComparison,
    ctx: Context,
  ) {
    const relativePerformanceCpus = await this.getRelativePerformanceCpus(
      comparison[0],
      comparison[1],
      ctx,
    );

    const relativeValueCpus = await this.getRelativeValueCpus(
      comparison[0],
      comparison[1],
      ctx,
    );

    return {
      relativePerformanceCpus,
      relativeValueCpus,
    } as CompareCpusAdditionalData;
  }

  private async getRelativePerformanceCpus(
    seed1: CpuProduct,
    seed2: CpuProduct,
    ctx: Context,
  ) {
    const relative1 = await this.fetchRelativePerformanceCpus(seed1, ctx);
    const relative2 = await this.fetchRelativePerformanceCpus(seed2, ctx);

    const cpu1Idx = binarySearch(
      relative1,
      seed1,
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performanceRating) -
        productFieldRawValue(c1.fields?.performanceRating),
    );
    const neighbors1 = getSurroundingValues(
      relative1,
      cpu1Idx,
      TOTAL_COMPARED_CPUS,
    );

    const cpu2Idx = binarySearch(
      relative2,
      seed2,
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performanceRating) -
        productFieldRawValue(c1.fields?.performanceRating),
    );
    const neighbors2 = getSurroundingValues(
      relative2,
      cpu2Idx,
      TOTAL_COMPARED_CPUS,
    );

    // At least one cpu has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex(
          (cpu) => cpu.id === seed1.id || cpu.id === seed2.id,
        ),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both cpus have neighbors
    const hasNoGap =
      neighbors1.find((p) => p.id === seed2.id) ||
      neighbors2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performanceRating) -
          productFieldRawValue(c1.fields?.performanceRating),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performanceRating) -
          productFieldRawValue(c1.fields?.performanceRating),
      );
    }
  }

  private async getRelativeValueCpus(
    seed1: CpuProduct,
    seed2: CpuProduct,
    ctx: Context,
  ) {
    const relative1 = await this.fetchRelativeValueCpus(seed1, ctx);
    const relative2 = await this.fetchRelativeValueCpus(seed2, ctx);

    const cpu1Idx = binarySearch(
      relative1,
      seed1,
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performancePerMsrp) -
        productFieldRawValue(c1.fields?.performancePerMsrp),
    );
    const neighbors1 = getSurroundingValues(
      relative1,
      cpu1Idx,
      TOTAL_COMPARED_CPUS,
    );

    const cpu2Idx = binarySearch(
      relative2,
      seed2,
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performancePerMsrp) -
        productFieldRawValue(c1.fields?.performancePerMsrp),
    );
    const neighbors2 = getSurroundingValues(
      relative2,
      cpu2Idx,
      TOTAL_COMPARED_CPUS,
    );

    // At least one cpu has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex(
          (cpu) => cpu.id === seed1.id || cpu.id === seed2.id,
        ),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both cpus have neighbors
    const hasNoGap =
      neighbors1.find((p) => p.id === seed2.id) ||
      neighbors2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performancePerMsrp) -
          productFieldRawValue(c1.fields?.performancePerMsrp),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performancePerMsrp) -
          productFieldRawValue(c1.fields?.performancePerMsrp),
      );
    }
  }

  private async fetchRelativePerformanceCpus(seed: CpuProduct, ctx: Context) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }

    const segment = productFieldRawValue(seed.fields?.marketSegment) || null;
    const performanceScore = productFieldRawValue(
      seed.fields.performanceRating,
    );

    // Get ids for relative cpus with a higher rating
    const aboveRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          performanceRated: true,
          minPerformanceScore: performanceScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Asc,
          sort: ListSort.PerformanceRating,
        },
      },
    };
    const aboveOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const aboveResponse = await this.productService.list(
      aboveRequest,
      aboveOptions,
      ctx,
    );

    // Get ids for relative cpus with a lower rating
    const belowRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          performanceRated: true,
          maxPerformanceScore: performanceScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Desc,
          sort: ListSort.PerformanceRating,
        },
      },
    };
    const belowOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const belowResponse = await this.productService.list(
      belowRequest,
      belowOptions,
      ctx,
    );

    // Fetch relative cpus by id
    const relativeIds = [
      ...aboveResponse.results,
      ...belowResponse.results,
    ].map((result) => result.id);
    const relativeResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: {
            ids: relativeIds,
            excludeIds: [seed.id],
          },
        },
      },
      { fields: ['performanceRating'], skipCount: true },
      ctx,
    );

    // Sort related cpus by performance
    const cpus = [...relativeResponse.results, seed]
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performanceRating) != null,
      )
      .sort(
        (c1, c2) =>
          productFieldRawValue(c1.fields?.performanceRating) -
          productFieldRawValue(c2.fields?.performanceRating),
      ) as CpuProduct[];

    // Build list of surrounding cpus
    const cpuIdx = binarySearch(
      cpus,
      seed,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performanceRating) -
        productFieldRawValue(c2.fields?.performanceRating),
    );
    const neighbors = getSurroundingValues(cpus, cpuIdx, TOTAL_COMPARED_CPUS);

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performanceRating) -
        productFieldRawValue(c1.fields?.performanceRating),
    );
  }

  private async fetchRelativeValueCpus(seed: CpuProduct, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const segment = productFieldRawValue(seed.fields?.marketSegment) || null;
    const valueScore = productFieldRawValue(seed.fields.performancePerMsrp);

    // Get ids for relative cpus with a higher rating
    const aboveRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          valueRated: true,
          minValueScore: valueScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Asc,
          sort: ListSort.PerformancePerMsrp,
        },
      },
    };
    const aboveOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const aboveResponse = await this.productService.list(
      aboveRequest,
      aboveOptions,
      ctx,
    );

    // Get ids for relative cpus with a lower rating
    const belowRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          segment: segment ? [segment] : [],
          valueRated: true,
          maxValueScore: valueScore,
        },
        pagination: {
          limit: TOTAL_COMPARED_CPUS,
        },
        orderBy: {
          order: ListOrder.Desc,
          sort: ListSort.PerformancePerMsrp,
        },
      },
    };
    const belowOptions = {
      fields: [] as ProductFieldKey[],
      skipCount: true,
    };
    const belowResponse = await this.productService.list(
      belowRequest,
      belowOptions,
      ctx,
    );

    // Fetch relative cpus by id
    const relativeIds = [
      ...aboveResponse.results,
      ...belowResponse.results,
    ].map((result) => result.id);
    const relativeResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: { ids: relativeIds, excludeIds: [seed.id] },
        },
      },
      { fields: ['performancePerMsrp'], skipCount: true },
      ctx,
    );

    // Sort related cpus by value
    const cpus = [...relativeResponse.results, seed]
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performancePerMsrp) != null,
      )
      .sort(
        (c1, c2) =>
          productFieldRawValue(c1.fields?.performancePerMsrp) -
          productFieldRawValue(c2.fields?.performancePerMsrp),
      ) as CpuProduct[];

    // Build list of surrounding cpus
    const cpuIdx = binarySearch(
      cpus,
      seed,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performancePerMsrp) -
        productFieldRawValue(c2.fields?.performancePerMsrp),
    );
    const neighbors = getSurroundingValues(cpus, cpuIdx, TOTAL_COMPARED_CPUS);

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performancePerMsrp) -
        productFieldRawValue(c1.fields?.performancePerMsrp),
    );
  }

  private concatNeighbors(
    comparison: CpuProductComparison,
    neighbors1: CpuProduct[],
    neighbors2: CpuProduct[],
    compareFn: (cpu1: CpuProduct, cpu2: CpuProduct) => number,
  ) {
    const [cpu1, cpu2] = comparison;

    // Get the nearest neighbors for both CPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((cpu) => cpu.id === cpu1.id),
      TOTAL_COMPARED_CPUS / 2,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((cpu) => cpu.id === cpu2.id),
      TOTAL_COMPARED_CPUS / 2,
    );

    // Combine them and sort.
    const set = [...surrounding1, ...surrounding2].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);
    return Object.values(set).sort(compareFn);
  }

  private mergeNeighbors(
    comparison: CpuProductComparison,
    neighbors1: CpuProduct[],
    neighbors2: CpuProduct[],
    compareFn: (cpu1: CpuProduct, cpu2: CpuProduct) => number,
  ) {
    const [cpu1, cpu2] = comparison;

    // Get the nearest neighbors for both CPUs
    const surrounding1 = getSurroundingValues(
      neighbors1,
      neighbors1.findIndex((cpu) => cpu.id === cpu1.id),
      TOTAL_COMPARED_CPUS,
    );
    const surrounding2 = getSurroundingValues(
      neighbors2,
      neighbors2.findIndex((cpu) => cpu.id === cpu2.id),
      TOTAL_COMPARED_CPUS,
    );

    // Combine the nearest neighbors. Factor in that they may overlap.
    const set = [...surrounding1, ...surrounding2].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);
    const merged = Object.values(set).sort(compareFn);

    // Find the middle point between the two CPUs that are being compared.
    const idx1 = merged.findIndex((cpu) => cpu.id === cpu1.id);
    const idx2 = merged.findIndex((cpu) => cpu.id === cpu2.id);
    const pivot = Math.ceil((idx1 + idx2) / 2);

    // Find the CPUs surrounding the middle point.
    return getSurroundingValues(merged, pivot, TOTAL_COMPARED_CPUS);
  }

  private async getRelatedCpus(
    total: number,
    performanceCpus: CpuProduct[],
    valueCpus: CpuProduct[],
    excludeCpus: CpuProduct[],
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    excludeCpus.forEach((cpu) => set.delete(cpu.id));

    const related: CpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    return { products: related } as RelatedProducts;
  }

  private async getRelatedComparisons(
    total: number,
    performanceCpus: CpuProduct[],
    valueCpus: CpuProduct[],
    pageComparison: CpuProductComparison,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    pageComparison.forEach((cpu) => set.delete(cpu.id));

    const related: CpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedCpu, i) => [
      pageComparison[i % 2],
      relatedCpu,
    ]);

    return { comparisons } as RelatedProductComparisons;
  }
}
