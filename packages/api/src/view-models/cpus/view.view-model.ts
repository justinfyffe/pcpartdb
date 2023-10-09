import { Injectable } from '@nestjs/common';
import {
  CpuProduct,
  hasProductFieldRawValue,
  ListOrder,
  ListSort,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
  ViewCpuContentData,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { ProductService } from '../../product/product.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class ViewCpuViewModelService {
  constructor(private productService: ProductService) {}

  async viewModel(slug: string, ctx: Context) {
    const cpu = await this.getCpu(slug, ctx);
    const additionalData = await this.getAdditionalData(cpu, ctx);

    const relatedCpus = await this.getRelatedCpus(
      3,
      additionalData.relativePerformanceCpus,
      additionalData.relativeValueCpus,
      cpu,
    );
    const relatedComparisons = await this.getRelatedComparisons(
      3,
      additionalData.relativePerformanceCpus,
      additionalData.relativeValueCpus,
      cpu,
    );

    return {
      cpu,
      additionalData: additionalData,
      relatedCpus,
      relatedCpuComparisons: relatedComparisons,
    } as ViewCpuViewModel;
  }

  private async getCpu(slug: string, ctx: Context) {
    const product = await this.productService.getBySlug(
      {
        productType: ProductType.Cpu,
        slug,

        includeParent: false,
        includeChildren: false,
        includeAutomation: false,
        includeBenchmarks: true,
        includeImages: true,
        includeSources: false,
        includeUpdates: false,

        includeRanks: [
          'performanceRating',
          'performanceRatingForMarketSegment',
          'performancePerMsrp',
          'performancePerMsrpForMarketSegment',
        ],
      },
      ctx,
    );

    return product as CpuProduct;
  }

  private async getAdditionalData(cpu: CpuProduct, ctx: Context) {
    const relativePerformanceCpus = await this.getRelativePerformanceCpus(
      cpu,
      ctx,
    );
    const relativeValueCpus = await this.getRelativeValueCpus(cpu, ctx);

    const totalPerformanceCpus = await this.productService.count(
      {
        productType: ProductType.Cpu,
        query: { filter: { performanceRated: true } },
      },
      ctx,
    );

    const bestPerformanceCpusResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: { performanceRated: true },
          orderBy: { sort: ListSort.PerformanceRating },
          pagination: { limit: 1 },
        },
      },
      {},
      ctx,
    );
    const bestPerformanceCpus = bestPerformanceCpusResponse.results;

    const bestValueCpusResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: { valueRated: true },
          orderBy: { sort: ListSort.PerformancePerMsrp },
          pagination: { limit: 1 },
        },
      },
      {},
      ctx,
    );
    const bestValueCpus = bestValueCpusResponse.results;

    return {
      totalPerformanceCpus: totalPerformanceCpus || [],
      relativePerformanceCpus: relativePerformanceCpus || [],
      relativeValueCpus: relativeValueCpus || [],
      bestPerformanceCpu: bestPerformanceCpus?.[0],
      bestValueCpu: bestValueCpus?.[0],
    } as ViewCpuContentData;
  }

  private async getRelativePerformanceCpus(seed: CpuProduct, ctx: Context) {
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(seed.fields?.marketSegment)
              ? [productFieldRawValue(seed.fields?.marketSegment)]
              : [],
            excludeIds: [seed.id],
            minPerformanceScore: productFieldRawValue(
              seed.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: { sort: ListSort.PerformanceRating, order: ListOrder.Asc },
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
            segment: hasProductFieldRawValue(seed.fields?.marketSegment)
              ? [productFieldRawValue(seed.fields?.marketSegment)]
              : [],
            excludeIds: [seed.id],
            maxPerformanceScore: productFieldRawValue(
              seed.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: { sort: ListSort.PerformanceRating, order: ListOrder.Desc },
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

    const neighbors = [
      ...new Map(
        [...aboveCpus, seed, ...belowCpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (cpu1, cpu2) =>
        productFieldRawValue(cpu2.fields?.performanceRating) -
        productFieldRawValue(cpu1.fields?.performanceRating),
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    );
  }

  private async getRelativeValueCpus(seed: CpuProduct, ctx: Context) {
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: {
          filter: {
            segment: hasProductFieldRawValue(seed.fields?.marketSegment)
              ? [productFieldRawValue(seed.fields?.marketSegment)]
              : [],
            excludeIds: [seed.id],
            minValueScore: productFieldRawValue(
              seed.fields?.performancePerMsrp,
            ),
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
            segment: hasProductFieldRawValue(seed.fields?.marketSegment)
              ? [productFieldRawValue(seed.fields?.marketSegment)]
              : [],
            excludeIds: [seed.id],
            maxValueScore: productFieldRawValue(
              seed.fields?.performancePerMsrp,
            ),
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

    const neighbors = [
      ...new Map(
        [...aboveCpus, seed, ...belowCpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (cpu1, cpu2) =>
        productFieldRawValue(cpu2.fields?.performancePerMsrp) -
        productFieldRawValue(cpu1.fields?.performancePerMsrp),
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    );
  }

  private async getRelatedCpus(
    total: number,
    performanceCpus: CpuProduct[],
    valueCpus: CpuProduct[],
    excludeCpu: CpuProduct,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeCpu.id);

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
    pageCpu: CpuProduct,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, CpuProduct>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageCpu.id);

    const related: CpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedCpu) => [pageCpu, relatedCpu]);

    return { comparisons } as RelatedProductComparisons;
  }
}
