import { Injectable } from '@nestjs/common';
import {
  CompareCpusAdditionalData,
  CompareCpusViewModel,
  CpuProduct,
  CpuProductComparison,
  hasProductFieldRawValue,
  ListOrder,
  ListSort,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
} from '@pcpartdb/shared';
import { ProductService } from '../../product/product.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class CompareCpusViewModelService {
  constructor(private productService: ProductService) {}

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
    const comparison = await this.productService.getComparison(
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

        includeRanks: ['performanceRating', 'performancePerMsrp'],
      },
      ctx,
    );
    return comparison as CpuProductComparison;
  }

  private async getAdditionalData(
    comparison: CpuProductComparison,
    ctx: Context,
  ) {
    return {
      relativePerformanceCpus: await this.getRelativePerformanceCpus(
        comparison,
        ctx,
      ),
      relativeValueCpus: await this.getRelativeValueCpus(comparison, ctx),
    } as CompareCpusAdditionalData;
  }

  private async getRelativePerformanceCpus(
    comparison: CpuProductComparison,
    ctx: Context,
  ) {
    const [cpu1, cpu2] = comparison;
    const neighbors1 = await this.getPerformanceNeighbors(cpu1, ctx);
    const neighbors2 = await this.getPerformanceNeighbors(cpu2, ctx);

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
    const hasGapBetweenNeighbors =
      Math.abs(cpu1.ranks?.performanceRating - cpu2.ranks?.performanceRating) >
      TOTAL_COMPARED_CPUS / 2 + 1;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.performanceRating - c2.ranks?.performanceRating,
      );
    } else {
      return this.mergeNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.performanceRating - c2.ranks?.performanceRating,
      );
    }
  }

  private async getRelativeValueCpus(
    comparison: CpuProductComparison,
    ctx: Context,
  ) {
    const [cpu1, cpu2] = comparison;
    const neighbors1 = await this.getValueNeighbors(cpu1, ctx);
    const neighbors2 = await this.getValueNeighbors(cpu2, ctx);

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
    const hasGapBetweenNeighbors =
      Math.abs(
        cpu1.ranks?.performancePerMsrp - cpu2.ranks?.performancePerMsrp,
      ) >
      TOTAL_COMPARED_CPUS / 2 + 1;

    if (hasGapBetweenNeighbors) {
      return this.concatNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.performancePerMsrp - c2.ranks?.performancePerMsrp,
      );
    } else {
      return this.mergeNeighbors(
        [cpu1, cpu2],
        neighbors1,
        neighbors2,
        (c1, c2) => c1.ranks?.performancePerMsrp - c2.ranks?.performancePerMsrp,
      );
    }
  }

  private async getPerformanceNeighbors(cpu: CpuProduct, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldRawValue(cpu.fields?.performanceRating)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(cpu.fields?.marketSegment)
              ? [productFieldRawValue(cpu.fields?.marketSegment)]
              : [],
            excludeIds: [cpu.id],
            minPerformanceScore: productFieldRawValue(
              cpu.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: {
            sort: ListSort.PerformanceRating,
            order: ListOrder.Asc,
          },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
      },
      {
        fields: ['performanceRating'],
        includeRanks: ['performanceRating'],
      },
      ctx,
    );
    const aboveCpus = aboveResponse.results;

    const belowResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(cpu.fields?.marketSegment)
              ? [productFieldRawValue(cpu.fields?.marketSegment)]
              : [],
            excludeIds: [cpu.id],
            maxPerformanceScore: productFieldRawValue(
              cpu.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: {
            sort: ListSort.PerformanceRating,
            order: ListOrder.Desc,
          },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
      },
      {
        fields: ['performanceRating'],
        includeRanks: ['performanceRating'],
      },
      ctx,
    );
    const belowCpus = belowResponse.results;

    return [
      ...new Map(
        [...aboveCpus, cpu, ...belowCpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (cpu1, cpu2) =>
        productFieldRawValue(cpu2.fields?.performanceRating) -
        productFieldRawValue(cpu1.fields?.performanceRating),
    ) as CpuProduct[];
  }

  private async getValueNeighbors(cpu: CpuProduct, ctx: Context) {
    // Missing value. Cannot have neighbors.
    if (!hasProductFieldRawValue(cpu.fields?.performancePerMsrp)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(cpu.fields?.marketSegment)
              ? [productFieldRawValue(cpu.fields?.marketSegment)]
              : [],
            excludeIds: [cpu.id],
            minValueScore: productFieldRawValue(cpu.fields?.performancePerMsrp),
            valueRated: true,
          },
          orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Asc },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
      },
      {
        fields: ['performancePerMsrp'],
        includeRanks: ['performancePerMsrp'],
      },
      ctx,
    );
    const aboveCpus = aboveResponse.results;

    const belowResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(cpu.fields?.marketSegment)
              ? [productFieldRawValue(cpu.fields?.marketSegment)]
              : [],
            excludeIds: [cpu.id],
            maxValueScore: productFieldRawValue(cpu.fields?.performancePerMsrp),
            valueRated: true,
          },
          orderBy: {
            sort: ListSort.PerformancePerMsrp,
            order: ListOrder.Desc,
          },
          pagination: { limit: TOTAL_COMPARED_CPUS },
        },
      },
      {
        fields: ['performancePerMsrp'],
        includeRanks: ['performancePerMsrp'],
      },
      ctx,
    );
    const belowCpus = belowResponse.results;

    return [
      ...new Map(
        [...aboveCpus, cpu, ...belowCpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (cpu1, cpu2) =>
        productFieldRawValue(cpu2.fields?.performancePerMsrp) -
        productFieldRawValue(cpu1.fields?.performancePerMsrp),
    ) as CpuProduct[];
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
