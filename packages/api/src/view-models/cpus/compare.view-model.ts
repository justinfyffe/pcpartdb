import { Injectable } from '@nestjs/common';
import {
  CompareCpusAdditionalData,
  CompareCpusViewModel,
  CpuProduct,
  CpuProductComparison,
  hasProductFieldRawValue,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
  RelatedProductType,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
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
    const timer = `CompareCpusViewModelService (${uuid.v4()})`;
    console.time(timer);

    const viewModel = await this.cacheService.cache(
      async () => {
        const comparison = await this.getComparison(slug, ctx);
        const additionalData = await this.getAdditionalData(comparison);

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
    console.timeEnd(timer);

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
            includeRanks: true,
            includeRelated: true,

            relatedFields: ['performancePerMsrp', 'performanceRating'],
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return comparison as CpuProductComparison;
  }

  private async getAdditionalData(comparison: CpuProductComparison) {
    const relativePerformanceCpus = await this.getRelativePerformanceCpus(
      comparison[0],
      comparison[1],
    );

    const relativeValueCpus = await this.getRelativeValueCpus(
      comparison[0],
      comparison[1],
    );

    return {
      relativePerformanceCpus,
      relativeValueCpus,
    } as CompareCpusAdditionalData;
  }

  private async getRelativePerformanceCpus(
    seed1: CpuProduct,
    seed2: CpuProduct,
  ) {
    const relative1 = seed1.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformanceRating)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performanceRating))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performanceRating) -
          productFieldRawValue(p1?.fields?.performanceRating),
      ) as Partial<CpuProduct>[];
    const relative2 = seed2.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformanceRating)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performanceRating))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performanceRating) -
          productFieldRawValue(p1?.fields?.performanceRating),
      ) as Partial<CpuProduct>[];

    // At least one cpu has no neighbors (missing rank)
    if (relative1.length === 0 && relative2.length === 0) {
      return [];
    }
    if (relative1.length === 0 || relative2.length === 0) {
      const neighbors = [...relative1, ...relative2];
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
      relative1.find((p) => p.id === seed2.id) ||
      relative2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performanceRating) -
          productFieldRawValue(c1.fields?.performanceRating),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performanceRating) -
          productFieldRawValue(c1.fields?.performanceRating),
      );
    }
  }

  private async getRelativeValueCpus(seed1: CpuProduct, seed2: CpuProduct) {
    const relative1 = seed1.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformancePerMsrp)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performancePerMsrp))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performancePerMsrp) -
          productFieldRawValue(p1?.fields?.performancePerMsrp),
      ) as Partial<CpuProduct>[];
    const relative2 = seed2.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformancePerMsrp)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performancePerMsrp))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performancePerMsrp) -
          productFieldRawValue(p1?.fields?.performancePerMsrp),
      ) as Partial<CpuProduct>[];

    // At least one cpu has no neighbors (missing rank)
    if (relative1.length === 0 && relative2.length === 0) {
      return [];
    }
    if (relative1.length === 0 || relative2.length === 0) {
      const neighbors = [...relative1, ...relative2];
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
      relative1.find((p) => p.id === seed2.id) ||
      relative2.find((p) => p.id === seed1.id);

    if (hasNoGap) {
      return this.mergeNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performancePerMsrp) -
          productFieldRawValue(c1.fields?.performancePerMsrp),
      );
    } else {
      return this.concatNeighbors(
        [seed1, seed2],
        relative1,
        relative2,
        (c1, c2) =>
          productFieldRawValue(c2.fields?.performancePerMsrp) -
          productFieldRawValue(c1.fields?.performancePerMsrp),
      );
    }
  }

  private concatNeighbors(
    comparison: CpuProductComparison,
    neighbors1: Partial<CpuProduct>[],
    neighbors2: Partial<CpuProduct>[],
    compareFn: (cpu1: Partial<CpuProduct>, cpu2: Partial<CpuProduct>) => number,
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
    }, {} as Record<number, Partial<CpuProduct>>);
    return Object.values(set).sort(compareFn);
  }

  private mergeNeighbors(
    comparison: CpuProductComparison,
    neighbors1: Partial<CpuProduct>[],
    neighbors2: Partial<CpuProduct>[],
    compareFn: (cpu1: Partial<CpuProduct>, cpu2: Partial<CpuProduct>) => number,
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
    }, {} as Record<number, Partial<CpuProduct>>);
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
