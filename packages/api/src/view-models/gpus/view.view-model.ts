import { Injectable } from '@nestjs/common';
import {
  GpuProduct,
  hasProductFieldRawValue,
  ListOrder,
  ListSort,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
  ViewGpuAdditionalData,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { ProductService } from '../../product/product.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class ViewGpuViewModelService {
  constructor(private productService: ProductService) {}

  async viewModel(slug: string, ctx: Context) {
    const gpu = await this.getGpu(slug, ctx);
    const additionalData = await this.getAdditionalData(gpu, ctx);

    const relatedGpus = await this.getRelatedGpus(
      3,
      additionalData.relativePerformanceGpus,
      additionalData.relativeValueGpus,
      gpu,
    );
    const relatedGpuComparisons = await this.getRelatedComparisons(
      3,
      additionalData.relativePerformanceGpus,
      additionalData.relativeValueGpus,
      gpu,
    );

    return {
      gpu,
      relatedGpus,
      relatedGpuComparisons,
      additionalData,
    } as ViewGpuViewModel;
  }

  private async getGpu(slug: string, ctx: Context) {
    const product = await this.productService.getBySlug(
      {
        productType: ProductType.Gpu,
        slug,

        includeParent: true,
        includeChildren: false,
        includeAutomation: false,
        includeBenchmarks: true,
        includeImages: true,
        includeSources: false,
        includeUpdates: false,

        parentFields: ['msrp', 'performanceRating', 'performancePerMsrp'],
        includeRanks: [
          'performanceRating',
          'performanceRatingForArchitectureAndMarketSegment',
          'performanceRatingForMarketSegment',
          'performancePerMsrp',
          'performanceRatingForMarketSegment',
        ],
      },
      ctx,
    );

    return product as GpuProduct;
  }

  private async getAdditionalData(gpu: GpuProduct, ctx: Context) {
    const segment = productFieldRawValue(gpu.fields?.marketSegment);

    const relativePerformanceGpus = await this.getRelativePerformanceGpus(
      (gpu.parent || gpu) as GpuProduct,
      ctx,
    );
    const relativeValueGpus = await this.getRelativeValueGpus(
      (gpu.parent || gpu) as GpuProduct,
      ctx,
    );

    const totalPerformanceGpusResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: { filter: { isChipset: true, performanceRated: true } },
      },
      {},
      ctx,
    );
    const totalPerformanceGpus = totalPerformanceGpusResponse.total;

    const bestPerformanceSegmentGpusResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            isChipset: true,
            segment: segment != null ? [segment] : [],
            performanceRated: true,
          },
          orderBy: { sort: ListSort.PerformanceRating },
          pagination: { limit: 1 },
        },
      },
      {},
      ctx,
    );
    const bestPerformanceSegmentGpus =
      bestPerformanceSegmentGpusResponse.results;

    const bestValueSegmentGpusResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            isChipset: true,
            segment: segment != null ? [segment] : [],
            valueRated: true,
          },
          orderBy: { sort: ListSort.PerformancePerMsrp },
          pagination: { limit: 1 },
        },
      },
      {},
      ctx,
    );
    const bestValueSegmentGpus = bestValueSegmentGpusResponse.results;

    const retailModelsResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: { chipsetId: gpu.parent?.id || gpu.id, isRetailModel: true },
          orderBy: { sort: ListSort.Name },
        },
      },
      {
        fields: [
          'gpuCoreBaseClock',
          'gpuCoreBoostClock',
          'length',
          'slotWidth',
          'width',
          'height',
          'tdp',
        ],
      },
      ctx,
    );
    const retailModels = retailModelsResponse.results;

    return {
      totalPerformanceGpus,
      relativePerformanceGpus,
      relativeValueGpus,
      bestPerformanceGpuForSegment: bestPerformanceSegmentGpus?.[0],
      bestValueGpuForSegment: bestValueSegmentGpus?.[0],
      retailModels,
    } as ViewGpuAdditionalData;
  }

  private async getRelativePerformanceGpus(seed: GpuProduct, ctx: Context) {
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            isChipset: true,
            segment: hasProductFieldRawValue(seed.fields?.marketSegment)
              ? [productFieldRawValue(seed.fields?.marketSegment)]
              : [],
            excludeIds: [seed.id],
            minPerformanceScore: productFieldRawValue(
              seed.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: {
            sort: ListSort.PerformanceRating,
            order: ListOrder.Asc,
          },
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performanceRating'],
        includeRanks: ['performanceRating'],
      },
      ctx,
    );
    const aboveGpus = aboveResponse.results;

    const belowResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            isChipset: true,
            segment: hasProductFieldRawValue(seed.fields?.marketSegment)
              ? [productFieldRawValue(seed.fields?.marketSegment)]
              : [],
            excludeIds: [seed.id],
            maxPerformanceScore: productFieldRawValue(
              seed.fields?.performanceRating,
            ),
            performanceRated: true,
          },
          orderBy: {
            sort: ListSort.PerformanceRating,
            order: ListOrder.Desc,
          },
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performanceRating'],
        includeRanks: ['performanceRating'],
      },
      ctx,
    );
    const belowGpus = belowResponse.results;

    const neighbors = [
      ...new Map(
        [...aboveGpus, seed, ...belowGpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (gpu1, gpu2) =>
        productFieldRawValue(gpu2.fields?.performanceRating) -
        productFieldRawValue(gpu1.fields?.performanceRating),
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    );
  }

  private async getRelativeValueGpus(seed: GpuProduct, ctx: Context) {
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const aboveResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            isChipset: true,
            segment: hasProductFieldRawValue(seed.fields?.marketSegment)
              ? [productFieldRawValue(seed.fields?.marketSegment)]
              : [],
            excludeIds: [seed.id],
            minValueScore: productFieldRawValue(
              seed.fields?.performancePerMsrp,
            ),
            valueRated: true,
          },
          orderBy: {
            sort: ListSort.PerformancePerMsrp,
            order: ListOrder.Asc,
          },
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performancePerMsrp'],
        includeRanks: ['performancePerMsrp'],
      },
      ctx,
    );
    const aboveGpus = aboveResponse.results;

    const belowResponse = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: {
          filter: {
            isChipset: true,
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
          pagination: { limit: TOTAL_COMPARED_GPUS },
        },
      },
      {
        fields: ['performancePerMsrp'],
        includeRanks: ['performancePerMsrp'],
      },
      ctx,
    );
    const belowGpus = belowResponse.results;

    const neighbors = [
      ...new Map(
        [...aboveGpus, seed, ...belowGpus].map((n) => [n.id, n]),
      ).values(),
    ].sort(
      (gpu1, gpu2) =>
        productFieldRawValue(gpu2.fields?.performancePerMsrp) -
        productFieldRawValue(gpu1.fields?.performancePerMsrp),
    );

    return getSurroundingValues(
      neighbors,
      neighbors.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    );
  }

  private async getRelatedGpus(
    total: number,
    performanceGpus: GpuProduct[],
    valueGpus: GpuProduct[],
    excludeGpu: GpuProduct,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, GpuProduct>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeGpu.id);

    const related: GpuProduct[] = [];
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
    performanceGpus: GpuProduct[],
    valueGpus: GpuProduct[],
    pageGpu: GpuProduct,
  ) {
    const map = [...performanceGpus, ...valueGpus].reduce((acc, gpu) => {
      acc[gpu.id] = gpu;
      return acc;
    }, {} as Record<number, GpuProduct>);

    const performanceIds = performanceGpus.map((gpu) => gpu.id);
    const valueIds = valueGpus.map((gpu) => gpu.id);

    const pageChipset = pageGpu.parent || pageGpu;
    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageChipset.id);

    const related: GpuProduct[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedGpu) => [pageChipset, relatedGpu]);

    return { comparisons } as RelatedProductComparisons;
  }
}
