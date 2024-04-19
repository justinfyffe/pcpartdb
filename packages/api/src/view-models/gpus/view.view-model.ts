import { Injectable } from '@nestjs/common';
import {
  getGpuChipset,
  getPreferredBenchmark,
  GpuProduct,
  ProductFieldKey,
  ProductType,
  RelativeDataProducts,
  removeEmptyValues,
  ViewGpuViewModel,
  viewGpuViewModelNormalizr,
} from '@pcpartdb/shared';
import { normalize } from 'normalizr';
import * as uuid from 'uuid';
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

      const timer = uuid.v4();
      console.time(timer + ' getGpu');
      const gpu = await this.getGpu(slug, gameSlug, ctx);
      console.timeEnd(timer + ' getGpu');
      const chipset = getGpuChipset(gpu);

      // console.time(timer + ' getRelativeDataProducts');
      const relativeDataProducts = await this.getRelativeDataProducts(
        chipset,
        gameSlug,
        ctx,
      );
      // console.timeEnd(timer + ' getRelativeDataProducts');

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

      console.time(timer + ' normalize');
      const sanitized = removeEmptyValues(result);
      const response = normalize(sanitized, viewGpuViewModelNormalizr);
      console.timeEnd(timer + ' normalize');
      // console.time(timer + ' removeEmptyValues');
      // response = removeEmptyValues(response);
      // console.timeEnd(timer + ' removeEmptyValues');
      return response;
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

        includeParent: true,
        includeChildren: true,
        includeRelated: true,

        includeBenchmarks: true,
        includeParentBenchmarks: true,
        includeRelatedBenchmarks: [preferredBenchmark],

        includeGames: true,
        includeParentGames: true,
        includeRelatedGames:
          gameSlug && gameSlug !== 'undefined' ? [gameSlug] : 'latest',

        includeRanks: true,
        includeParentRanks: true,
        includeRelatedRanks: [preferredBenchmark],

        parentFields: ['msrp'] as ProductFieldKey[],
        childrenFields: [
          'gpuCoreBaseClock',
          'gpuCoreBoostClock',
          'length',
          'slotWidth',
          'width',
          'height',
          'tdp',
        ] as ProductFieldKey[],
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
    const pageChipset = pageGpu.parent || pageGpu;
    return this.relativeDataProductsService.buildRelatedComparisons({
      total,
      relativeDataProducts: relativeGpus,
      excludeIds: [pageChipset.id],
    });
  }
}
