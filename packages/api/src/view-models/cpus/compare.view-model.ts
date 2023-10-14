import { Injectable } from '@nestjs/common';
import {
  binarySearch,
  CompareCpusAdditionalData,
  CompareCpusViewModel,
  CpuProduct,
  CpuProductComparison,
  hasProductFieldRawValue,
  ListProductsRequest,
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
  }

  private async getComparison(slug: string, ctx: Context) {
    const comparisonRequest = {
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
    };
    const cacheKey = comparisonRequest;
    const comparison = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.getComparison(comparisonRequest, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.CpuComparison, key: cacheKey },
    );
    return comparison as CpuProductComparison;
  }

  private async getAdditionalData(
    comparison: CpuProductComparison,
    ctx: Context,
  ) {
    const [performanceCpus, valueCpus] = await this.getAllRelativeCpus(
      comparison,
      ctx,
    );

    const relativePerformanceCpus = this.getRelativePerformanceCpus(
      comparison,
      performanceCpus,
    );

    const relativeValueCpus = this.getRelativeValueCpus(comparison, valueCpus);

    return {
      relativePerformanceCpus,
      relativeValueCpus,
    } as CompareCpusAdditionalData;
  }

  private async getAllRelativeCpus(
    comparison: CpuProductComparison,
    ctx: Context,
  ) {
    const [cpu1, cpu2] = comparison;

    // Missing performance. Cannot have neighbors.
    if (
      !hasProductFieldRawValue(cpu1.fields?.performanceRating) &&
      !hasProductFieldRawValue(cpu2.fields?.performanceRating)
    ) {
      return [[], []];
    }

    const segment = [
      productFieldRawValue(cpu1.fields?.marketSegment),
      productFieldRawValue(cpu2.fields?.marketSegment),
    ]
      .filter((value) => value != null)
      .sort();

    const listRequest: ListProductsRequest = {
      productType: ProductType.Cpu,
      query: {
        filter: {
          isChipset: true,
          segment,
          performanceRated: true,
        },
      },
    };
    const listOptions = {
      fields: ['performanceRating', 'performancePerMsrp'] as ProductFieldKey[],
      skipCount: true,
    };

    const cacheKey = { ...listRequest, ...listOptions };
    const response = await this.cacheService.cache(
      () =>
        this.db.transaction(
          () => this.productService.list(listRequest, listOptions, ctx),
          { ctx, isolationLevel: 'ReadUncommitted' },
        ),
      { type: CacheType.CpusList, key: cacheKey },
    );
    const cpus = response.results as CpuProduct[];

    const performance = cpus
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performanceRating) != null,
      )
      .sort(
        (c1, c2) =>
          productFieldRawValue(c1.fields?.performanceRating) -
          productFieldRawValue(c2.fields?.performanceRating),
      );

    const value = cpus
      .filter(
        (cpu) => productFieldRawValue(cpu.fields?.performancePerMsrp) != null,
      )
      .sort(
        (c1, c2) =>
          productFieldRawValue(c1.fields?.performancePerMsrp) -
          productFieldRawValue(c2.fields?.performancePerMsrp),
      );

    return [performance, value];
  }

  private getRelativePerformanceCpus(
    comparison: CpuProductComparison,
    sortedCpus: CpuProduct[],
  ) {
    const [cpu1, cpu2] = comparison;

    const cpu1Idx = binarySearch(
      sortedCpus,
      cpu1,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performanceRating) -
        productFieldRawValue(c2.fields?.performanceRating),
    );
    const neighbors1 = getSurroundingValues(
      sortedCpus,
      cpu1Idx,
      TOTAL_COMPARED_CPUS,
    );

    const cpu2Idx = binarySearch(
      sortedCpus,
      cpu2,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performanceRating) -
        productFieldRawValue(c2.fields?.performanceRating),
    );
    const neighbors2 = getSurroundingValues(
      sortedCpus,
      cpu2Idx,
      TOTAL_COMPARED_CPUS,
    );

    // At least one CPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex((cpu) => cpu.id === cpu1.id || cpu.id === cpu2.id),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both CPUS have neighbors
    const hasNoGap =
      neighbors1.find((p) => p.id === cpu2.id) ||
      neighbors2.find((p) => p.id === cpu1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performanceRating) -
          productFieldRawValue(c1.fields?.performanceRating),
      );
    } else {
      return this.concatNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performanceRating) -
          productFieldRawValue(c1.fields?.performanceRating),
      );
    }
  }

  private getRelativeValueCpus(
    comparison: CpuProductComparison,
    sortedCpus: CpuProduct[],
  ) {
    const [cpu1, cpu2] = comparison;

    const cpu1Idx = binarySearch(
      sortedCpus,
      cpu1,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performancePerMsrp) -
        productFieldRawValue(c2.fields?.performancePerMsrp),
    );
    const neighbors1 = getSurroundingValues(
      sortedCpus,
      cpu1Idx,
      TOTAL_COMPARED_CPUS,
    );

    const cpu2Idx = binarySearch(
      sortedCpus,
      cpu2,
      (c1, c2) =>
        productFieldRawValue(c1.fields?.performancePerMsrp) -
        productFieldRawValue(c2.fields?.performancePerMsrp),
    );
    const neighbors2 = getSurroundingValues(
      sortedCpus,
      cpu2Idx,
      TOTAL_COMPARED_CPUS,
    );

    // At least one CPU has no neighbors (missing rank)
    if (neighbors1.length === 0 && neighbors2.length === 0) {
      return [];
    }
    if (neighbors1.length === 0 || neighbors2.length === 0) {
      const neighbors = [...neighbors1, ...neighbors2];
      return getSurroundingValues(
        neighbors,
        neighbors.findIndex((cpu) => cpu.id === cpu1.id || cpu.id === cpu2.id),
        TOTAL_COMPARED_CPUS,
      );
    }

    // Both CPUs have neighbors. Need to combine them.
    const hasNoGap =
      neighbors1.find((p) => p.id === cpu2.id) ||
      neighbors2.find((p) => p.id === cpu1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performancePerMsrp) -
          productFieldRawValue(c1.fields?.performancePerMsrp),
      );
    } else {
      return this.concatNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performancePerMsrp) -
          productFieldRawValue(c1.fields?.performancePerMsrp),
      );
    }
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
