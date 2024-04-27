import { Injectable } from '@nestjs/common';
import {
  compactObject,
  CompareCpusViewModel,
  compareCpusViewModelNormalizr,
  CpuProductComparison,
  getPreferredBenchmark,
  ProductType,
  RelativeDataProducts,
} from '@pcpartdb/shared';
import { normalize } from 'normalizr';
import { ProductService } from '../../product/product.service';
import { RelativeDataProductsService } from '../../product/relative-data-products.service';
import { Context } from '../../shared/context';

const TOTAL_COMPARED_CPUS = 10;

@Injectable()
export class CompareCpusViewModelService {
  constructor(
    private productService: ProductService,
    private relativeDataProductsService: RelativeDataProductsService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const buildViewModel = async () => {
      const comparison = await this.getComparison(slug, ctx);
      const relativeDataProducts = await this.getRelativeDataProducts(
        comparison,
        ctx,
      );

      const relatedCpus = this.getRelatedCpus(
        5,
        relativeDataProducts,
        comparison,
      );
      const relatedCpuComparisons = this.getRelatedComparisons(
        5,
        relativeDataProducts,
        comparison,
      );

      const result = {
        comparison,
        relativeDataProducts,
        relatedCpus,
        relatedCpuComparisons,
      } as CompareCpusViewModel;

      const compact = compactObject(result);
      const response = normalize(compact, compareCpusViewModelNormalizr);
      return response;
    };

    const viewModel = await buildViewModel();
    return viewModel;
  }

  private async getComparison(slug: string, ctx: Context) {
    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );
    const comparison = await this.productService.getComparison(
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
    return comparison as CpuProductComparison;
  }

  private async getRelativeDataProducts(
    comparison: CpuProductComparison,
    ctx: Context,
  ) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Cpu,
    );

    return await this.relativeDataProductsService.buildRelativeDataProducts(
      {
        products: comparison,
        benchmark,
        total: TOTAL_COMPARED_CPUS,
      },
      ctx,
    );
  }

  private getRelatedCpus(
    total: number,
    relativeCpus: RelativeDataProducts,
    excludeCpus: CpuProductComparison,
  ) {
    return this.relativeDataProductsService.buildRelatedProducts({
      total,
      relativeDataProducts: relativeCpus,
      excludeIds: excludeCpus.map((cpu) => cpu.id),
    });
  }

  private getRelatedComparisons(
    total: number,
    relativeCpus: RelativeDataProducts,
    excludeCpus: CpuProductComparison,
  ) {
    return this.relativeDataProductsService.buildRelatedComparisons({
      total,
      relativeDataProducts: relativeCpus,
      excludeIds: excludeCpus.map((cpu) => cpu.id),
    });
  }
}
