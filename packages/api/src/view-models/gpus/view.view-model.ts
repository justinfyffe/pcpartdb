import { Injectable } from '@nestjs/common';
import {
  compactObject,
  getGpuChipset,
  getPreferredBenchmark,
  GpuProduct,
  ProductType,
  RelativeDataProducts,
  ViewGpuViewModel,
  viewGpuViewModelNormalizr,
} from '@pcpartdb/shared';
import { normalize } from 'normalizr';
import { ProductService } from '../../product/product.service';
import { RelativeDataProductsService } from '../../product/relative-data-products.service';
import { Context } from '../../shared/context';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class ViewGpuViewModelService {
  constructor(
    private productService: ProductService,
    private relativeDataProductsService: RelativeDataProductsService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const buildViewModel = async () => {
      const gameSlug = ctx.req?.query?.game as string;

      const gpu = await this.getGpu(slug, gameSlug, ctx);
      const chipset = getGpuChipset(gpu);

      const relativeDataProducts = await this.getRelativeDataProducts(
        chipset,
        gameSlug,
        ctx,
      );

      const relatedGpus = this.getRelatedGpus(5, relativeDataProducts, gpu);
      const relatedGpuComparisons = this.getRelatedComparisons(
        5,
        relativeDataProducts,
        gpu,
      );

      const result = {
        gpu,
        relativeDataProducts,
        relatedGpus,
        relatedGpuComparisons,
      } as ViewGpuViewModel;

      const response = normalize(result, viewGpuViewModelNormalizr);
      const sanitized = compactObject(response);

      return sanitized;
    };

    const viewModel = await buildViewModel();
    return viewModel;
  }

  private async getGpu(slug: string, gameSlug: string, ctx: Context) {
    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Gpu,
    );
    const gpu = await this.productService.getBySlug(
      {
        productType: ProductType.Gpu,
        slug,

        includeAutomation: false,
        includeImages: true,

        includeSources: false,
        includeUpdates: false,

        includeRelated: true,

        includeBenchmarks: true,
        includeRelatedBenchmarks: [preferredBenchmark],

        includeGames: true,
        includeRelatedGames:
          gameSlug && gameSlug !== 'undefined' ? [gameSlug] : 'latest',

        includeRanks: true,
        includeRelatedRanks: [preferredBenchmark],

        relatedFields: [],
      },
      ctx,
    );
    return gpu as GpuProduct;
  }

  private async getRelativeDataProducts(
    seed: GpuProduct,
    gameSlug: string,
    ctx: Context,
  ) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Gpu,
    );

    let game = seed.games?.[0]?.game?.slug;
    if (seed.games?.find((pg) => pg?.game?.slug === gameSlug)) {
      game = gameSlug;
    }

    return await this.relativeDataProductsService.buildRelativeDataProducts(
      {
        products: [seed],
        benchmark,
        game,
        total: TOTAL_COMPARED_GPUS,
      },
      ctx,
    );
  }

  private getRelatedGpus(
    total: number,
    relativeGpus: RelativeDataProducts,
    excludeGpu: Partial<GpuProduct>,
  ) {
    return this.relativeDataProductsService.buildRelatedProducts({
      total,
      relativeDataProducts: relativeGpus,
      excludeIds: [excludeGpu.id],
    });
  }

  private getRelatedComparisons(
    total: number,
    relativeGpus: RelativeDataProducts,
    pageGpu: Partial<GpuProduct>,
  ) {
    const pageChipset = pageGpu;
    return this.relativeDataProductsService.buildRelatedComparisons({
      total,
      relativeDataProducts: relativeGpus,
      excludeIds: [pageChipset.id],
    });
  }
}
