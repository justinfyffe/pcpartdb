import { Injectable } from '@nestjs/common';
import {
  CpuContentData,
  CpuProduct,
  hasProductFieldRawValue,
  ListOrder,
  ListSort,
  productFieldRawValue,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
  RelatedProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { CacheService, CacheType } from '../../shared/cache/cache.service';
import { Context } from '../../shared/context';
import { getSurroundingValues } from '../../shared/utils';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class ViewCpuViewModelService {
  constructor(
    private db: Database,
    private productService: ProductService,
    private cacheService: CacheService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const timer = `ViewCpuViewModelService (${uuid.v4()})`;
    console.time(timer);
    const viewModel = await this.cacheService.cache(
      async () => {
        const cpu = await this.getCpu(slug, ctx);

        const relativePerformanceCpus = await this.getRelativePerformanceCpus(
          cpu,
        );
        const relativeValueCpus = await this.getRelativeValueCpus(cpu);

        const relatedCpus = await this.getRelatedCpus(
          3,
          relativePerformanceCpus,
          relativeValueCpus,
          cpu,
        );
        const relatedComparisons = await this.getRelatedComparisons(
          3,
          relativePerformanceCpus,
          relativeValueCpus,
          cpu,
        );

        const contentData: CpuContentData = {
          bestPerformanceCpu: await this.getBestPerformanceCpu(ctx),
        };

        return {
          cpu,

          relativePerformanceCpus,
          relativeValueCpus,

          relatedCpus,
          relatedCpuComparisons: relatedComparisons,

          contentData,
        } as ViewCpuViewModel;
      },
      { type: CacheType.CpuProduct, key: `viewModel__${slug}` },
    );
    console.timeEnd(timer);

    return viewModel;
  }

  private async getCpu(slug: string, ctx: Context) {
    const cpu = await this.db.transaction(
      () =>
        this.productService.getBySlug(
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
            includeRanks: true,
            includeRelated: true,
            relatedFields: ['performanceRating', 'performancePerMsrp'],
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadCommitted' },
    );
    return cpu as CpuProduct;
  }

  private async getRelativePerformanceCpus(seed: CpuProduct) {
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
      ) as Partial<CpuProduct>[];

    return getSurroundingValues(
      relative,
      relative.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performanceRating) -
        productFieldRawValue(c1.fields?.performanceRating),
    );
  }

  private async getRelativeValueCpus(seed: CpuProduct) {
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
      ) as Partial<CpuProduct>[];

    return getSurroundingValues(
      relative,
      relative.findIndex((cpu) => cpu.id === seed.id),
      TOTAL_COMPARED_CPUS,
    ).sort(
      (c1, c2) =>
        productFieldRawValue(c2.fields?.performancePerMsrp) -
        productFieldRawValue(c1.fields?.performancePerMsrp),
    );
  }

  private async getRelatedCpus(
    total: number,
    performanceCpus: Partial<CpuProduct>[],
    valueCpus: Partial<CpuProduct>[],
    excludeCpu: Partial<CpuProduct>,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Partial<CpuProduct>>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(excludeCpu.id);

    const related: Partial<CpuProduct>[] = [];
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
    performanceCpus: Partial<CpuProduct>[],
    valueCpus: Partial<CpuProduct>[],
    pageCpu: Partial<CpuProduct>,
  ) {
    const map = [...performanceCpus, ...valueCpus].reduce((acc, cpu) => {
      acc[cpu.id] = cpu;
      return acc;
    }, {} as Record<number, Partial<CpuProduct>>);

    const performanceIds = performanceCpus.map((cpu) => cpu.id);
    const valueIds = valueCpus.map((cpu) => cpu.id);

    const set = new Set([...performanceIds, ...valueIds]);
    set.delete(pageCpu.id);

    const related: Partial<CpuProduct>[] = [];
    for (let i = 0; i < total && set.size > 0; ++i) {
      const randIdx = Math.floor(Math.random() * set.size);
      const id = [...set.values()][randIdx];
      set.delete(id);

      related.push(map[id]);
    }

    const comparisons = related.map((relatedCpu) => [pageCpu, relatedCpu]);

    return { comparisons } as RelatedProductComparisons;
  }

  private async getBestPerformanceCpu(ctx: Context) {
    return await this.db.transaction(
      async () => {
        const response = await this.productService.list(
          {
            productType: ProductType.Cpu,
            query: {
              filter: { performanceRated: true },
              orderBy: {
                sort: ListSort.PerformanceRating,
                order: ListOrder.Desc,
              },
              pagination: { limit: 1 },
            },
          },
          {},
          ctx,
        );
        return (response.results?.[0] || null) as CpuProduct;
      },
      { ctx, isolationLevel: 'ReadCommitted' },
    );
  }
}
