import { Injectable } from '@nestjs/common';
import {
  getGpuChipset,
  GpuProduct,
  hasProductFieldRawValue,
  ListOrder,
  ListSort,
  ProductFieldKey,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
  RelatedProductType,
  ViewGpuAdditionalData,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class ViewGpuViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const timer = `ViewGpuViewModelService (${uuid.v4()})`;
    console.time(timer);
    const viewModel = await this.cacheService.cache(
      async () => {
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
      },
      { type: CacheType.GpuProduct, key: `viewModel__${slug}` },
    );
    console.timeEnd(timer);

    return viewModel;
  }

  private async getGpu(slug: string, ctx: Context) {
    const gpu = await this.db.transaction(
      () =>
        this.productService.getBySlug(
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
            includeRanks: true,
            includeRelated: true,
            relatedFields: ['performanceRating', 'performancePerMsrp'],

            parentFields: [
              'msrp',
              'performanceRating',
              'performancePerMsrp',
            ] as ProductFieldKey[],
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return gpu as GpuProduct;
  }

  private async getAdditionalData(gpu: GpuProduct, ctx: Context) {
    const chipset = getGpuChipset(gpu);

    const relativePerformanceGpus = await this.getRelativePerformanceGpus(
      chipset,
    );
    // TODO: migrate to new related structure
    const relativeValueGpus = await this.getRelativeValueGpus(chipset);

    const {
      totalPerformanceGpus,
      bestPerformanceSegmentGpu,
      bestValueSegmentGpu,
    } = await this.getGpuStats(gpu, ctx);

    const retailModels = await this.getRetailModels(chipset, ctx);

    return {
      totalPerformanceGpus,
      relativePerformanceGpus,
      relativeValueGpus,
      bestPerformanceGpuForSegment: bestPerformanceSegmentGpu,
      bestValueGpuForSegment: bestValueSegmentGpu,
      retailModels,
    } as ViewGpuAdditionalData;
  }

  private async getRelativePerformanceGpus(seed: GpuProduct) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performanceRating)) {
      return [];
    }

    const relative = seed.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformanceRating)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performanceRating))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performanceRating) -
          productFieldRawValue(p1?.fields?.performanceRating),
      ) as Partial<GpuProduct>[];

    return getSurroundingValues(
      relative,
      relative.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    ).sort(
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performanceRating) -
        productFieldRawValue(g1.fields?.performanceRating),
    );
  }

  private async getRelativeValueGpus(seed: GpuProduct) {
    // Missing performance. Cannot have neighbors.
    if (!hasProductFieldRawValue(seed.fields?.performancePerMsrp)) {
      return [];
    }

    const relative = seed.relatedProducts
      ?.filter((rp) => rp.type === RelatedProductType.PerformancePerMsrp)
      .map((r) => r.relatedProduct)
      .filter((p) => hasProductFieldRawValue(p?.fields?.performancePerMsrp))
      .sort(
        (p1, p2) =>
          productFieldRawValue(p2?.fields?.performancePerMsrp) -
          productFieldRawValue(p1?.fields?.performancePerMsrp),
      ) as Partial<GpuProduct>[];

    return getSurroundingValues(
      relative,
      relative.findIndex((gpu) => gpu.id === seed.id),
      TOTAL_COMPARED_GPUS,
    ).sort(
      (g1, g2) =>
        productFieldRawValue(g2.fields?.performancePerMsrp) -
        productFieldRawValue(g1.fields?.performancePerMsrp),
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

  private async getRetailModels(gpu: GpuProduct, ctx: Context) {
    const chipset = getGpuChipset(gpu);

    const response = await this.db.transaction(
      () =>
        this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: { chipsetId: [chipset.id] },
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
            ] as ProductFieldKey[],
            skipCount: true,
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return response.results;
  }

  private async getGpuStats(gpu: GpuProduct, ctx: Context) {
    // cache all of the following
    const countRequest = {
      productType: ProductType.Gpu,
      query: { filter: { isChipset: true, performanceRated: true } },
    };
    const totalPerformanceGpus = await this.db.transaction(
      () => this.productService.count(countRequest, ctx),
      { ctx, isolationLevel: 'ReadCommitted' },
    );

    const segment = productFieldRawValue(gpu.fields?.marketSegment);

    // TODO: convert to find instead of list
    const bestPerformanceSegmentGpu = await this.db.transaction(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: {
                isChipset: true,
                segment: segment != null ? [segment] : [],
                performanceRated: true,
              },
              orderBy: {
                sort: ListSort.PerformanceRating,
                order: ListOrder.Desc,
              },
              pagination: { limit: 1 },
            },
          },
          { skipCount: true },
          ctx,
        );
        return response.results?.[0] || null;
      },
      { ctx, isolationLevel: 'ReadCommitted' },
    );

    // TODO: convert to find instead of list
    const bestValueSegmentGpu = await this.db.transaction(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Gpu,
            query: {
              filter: {
                isChipset: true,
                segment: segment != null ? [segment] : [],
                valueRated: true,
              },
              orderBy: {
                sort: ListSort.PerformancePerMsrp,
                order: ListOrder.Desc,
              },
              pagination: { limit: 1 },
            },
          },
          { skipCount: true },
          ctx,
        );
        return response.results?.[0] || null;
      },
      { ctx, isolationLevel: 'ReadCommitted' },
    );

    return {
      totalPerformanceGpus,
      bestPerformanceSegmentGpu,
      bestValueSegmentGpu,
    };
  }
}
