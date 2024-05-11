import { Injectable } from '@nestjs/common';
import {
  compactObject,
  CompareGpusViewModel,
  compareGpusViewModelNormalizr,
  getPreferredBenchmark,
  GpuProductComparison,
  ProductType,
  RelativeDataProducts,
} from '@pcpartdb/shared';
import { normalize } from 'normalizr';
import { ProductService } from '../../product/product.service';
import { RelativeDataProductsService } from '../../product/relative-data-products.service';
import { Context } from '../../shared/context';

const TOTAL_COMPARED_GPUS = 10;

@Injectable()
export class CompareGpusViewModelService {
  constructor(
    private productService: ProductService,
    private relativeDataProductsService: RelativeDataProductsService,
  ) {}

  async viewModel(slug: string, ctx: Context) {
    const buildViewModel = async () => {
      const gameSlug = ctx.req?.query?.game as string;

      const comparison = await this.getComparison(slug, gameSlug, ctx);
      const relativeDataProducts = await this.getRelativeDataProducts(
        comparison,
        gameSlug,
        ctx,
      );

      const relatedGpus = this.getRelatedGpus(
        5,
        relativeDataProducts,
        comparison,
      );
      const relatedGpuComparisons = this.getRelatedComparisons(
        5,
        relativeDataProducts,
        comparison,
      );

      const result = {
        comparison,
        relativeDataProducts,
        relatedGpus,
        relatedGpuComparisons,
      } as CompareGpusViewModel;

      const compact = compactObject(result);
      const response = normalize(compact, compareGpusViewModelNormalizr);
      return response;
    };

    const viewModel = await buildViewModel();
    return viewModel;
  }

  private async getComparison(slug: string, gameSlug: string, ctx: Context) {
    const preferredBenchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Gpu,
    );
    const comparison = await this.productService.getComparison(
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

        relatedFields: [],
      },
      ctx,
    );
    return comparison as GpuProductComparison;
  }

  private async getRelativeDataProducts(
    comparison: GpuProductComparison,
    gameSlug: string,
    ctx: Context,
  ) {
    const benchmark = getPreferredBenchmark(
      ctx.config?.userSettings,
      ProductType.Gpu,
    );

    const [seed1, seed2] = comparison;
    const game1 = seed1.games?.[0]?.game;
    const game2 = seed2.games?.[0]?.game;
    const games = [game1, game2].sort((a, b) =>
      (b?.releaseDate ?? '').localeCompare(a?.releaseDate ?? ''),
    );
    let game = games?.[0]?.slug;
    if (
      seed1.games?.find((pg) => pg?.game?.slug === gameSlug) ||
      seed2.games?.find((pg) => pg?.game?.slug === gameSlug)
    ) {
      game = gameSlug;
    }

    return await this.relativeDataProductsService.buildRelativeDataProducts(
      {
        products: comparison,
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
    excludeGpus: GpuProductComparison,
  ) {
    return this.relativeDataProductsService.buildRelatedProducts({
      total,
      relativeDataProducts: relativeGpus,
      excludeIds: excludeGpus.map((gpu) => gpu.id),
    });
  }

  private getRelatedComparisons(
    total: number,
    relativeGpus: RelativeDataProducts,
    excludeGpus: GpuProductComparison,
  ) {
    return this.relativeDataProductsService.buildRelatedComparisons({
      total,
      relativeDataProducts: relativeGpus,
      excludeIds: excludeGpus.map((gpu) => gpu.id),
    });
  }
}
