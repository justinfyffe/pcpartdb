import { Injectable } from '@nestjs/common';
import {
  deepmerge,
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  getPreferredBenchmark,
  ListGpusQuery,
  ListGpusRequest,
  listProductsRequestSchema,
  ListSort,
  ProductType,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { Database } from '../../database';
import { ProductService } from '../../product/product.service';
import { Context } from '../../shared/context';
import { validate } from '../../shared/validation/validate';

@Injectable()
export class ListGpusViewModelService {
  constructor(private db: Database, private productService: ProductService) {}

  async viewModel(request: ListGpusRequest, ctx: Context) {
    const timer = `ListGpusViewModelService (${uuid.v4()})`;
    console.time(timer);
    validate(request, listProductsRequestSchema);
    const query = request.query;

    const chipsetsQuery = deepmerge(
      {},
      {
        filter: { productType: ProductType.Gpu, isChipset: true },
        pagination: {
          offset: DEFAULT_LIST_GPUS_OFFSET,
          limit: DEFAULT_LIST_GPUS_LIMIT,
        },
        orderBy: {
          sort: ListSort.PerformanceRating,
        },
      } as ListGpusQuery,
      query,
    );

    const userSettings = ctx.config?.userSettings;
    const preferredBenchmark = getPreferredBenchmark(
      userSettings,
      ProductType.Gpu,
    );
    const response = await this.productService.list(
      { query: chipsetsQuery },
      {
        fields: [
          'releaseDate',
          'gpuCoreBaseClock',
          'gpuCoreBoostClock',
          'length',
          'slotWidth',
          'width',
          'height',
          'tdp',
          'marketSegment',
          'msrp',
        ],
        includeAdditionalData: true,
        includeBenchmarks: [preferredBenchmark],
        includeRanks: [preferredBenchmark],
      },
      ctx,
    );
    console.timeEnd(timer);

    return response;
  }
}
