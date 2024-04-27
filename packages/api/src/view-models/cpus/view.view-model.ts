import { Injectable } from '@nestjs/common';
import {
  compactObject,
  CpuProduct,
  getPreferredBenchmark,
  ProductType,
  RelativeDataProducts,
  ViewCpuViewModel,
  viewCpuViewModelNormalizr,
} from '@pcpartdb/shared';
import { normalize } from 'normalizr';
import { ProductService } from '../../product/product.service';
import { RelativeDataProductsService } from '../../product/relative-data-products.service';
import { Context } from '../../shared/context';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class ViewCpuViewModelService {
  constructor(
    private productService: ProductService,
    private relativeDataProductsService: RelativeDataProductsService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const buildViewModel = async () => {
      const cpu = await this.getCpu(slug, ctx);
      const relativeDataProducts = await this.getRelativeDataProducts(cpu, ctx);

      const relatedCpus = this.getRelatedCpus(5, relativeDataProducts, cpu);
      const relatedCpuComparisons = this.getRelatedComparisons(
        5,
        relativeDataProducts,
        cpu,
      );

      const result = {
        cpu,
        relativeDataProducts,
        relatedCpus,
        relatedCpuComparisons,
      } as ViewCpuViewModel;

      const compact = compactObject(result);
      const response = normalize(compact, viewCpuViewModelNormalizr);
      return response;
    };

    const viewModel = await buildViewModel();
    return viewModel;
  }

  private async getCpu(slug: string, ctx: Context) {
    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );
    const cpu = await this.productService.getBySlug(
      {
        productType: ProductType.Cpu,
        slug,

        includeAutomation: false,
        includeImages: true,

        includeSources: false,
        includeUpdates: false,

        includeParent: false,
        includeChildren: false,
        includeRelated: true,

        includeBenchmarks: true,
        includeRelatedBenchmarks: [preferredBenchmark],

        includeRanks: true,
        includeParentRanks: false,
        includeRelatedRanks: [preferredBenchmark],

        parentFields: [],
        childrenFields: [],
        relatedFields: [],
      },
      ctx,
    );
    return cpu as CpuProduct;
  }

  private async getRelativeDataProducts(seed: CpuProduct, ctx: Context) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );

    return await this.relativeDataProductsService.buildRelativeDataProducts(
      {
        products: [seed],
        benchmark,
        total: TOTAL_COMPARED_CPUS,
      },
      ctx,
    );
  }

  private getRelatedCpus(
    total: number,
    relativeCpus: RelativeDataProducts,
    excludeGpu: Partial<CpuProduct>,
  ) {
    return this.relativeDataProductsService.buildRelatedProducts({
      total,
      relativeDataProducts: relativeCpus,
      excludeIds: [excludeGpu.id],
    });
  }

  private getRelatedComparisons(
    total: number,
    relativeCpus: RelativeDataProducts,
    pageCpu: Partial<CpuProduct>,
  ) {
    return this.relativeDataProductsService.buildRelatedComparisons({
      total,
      relativeDataProducts: relativeCpus,
      excludeIds: [pageCpu.id],
    });
  }
}
