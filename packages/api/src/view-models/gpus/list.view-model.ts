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
import { ProductService } from '../../product/product.service';
import { Context } from '../../shared/context';
import { validate } from '../../shared/validation/validate';

@Injectable()
export class ListGpusViewModelService {
  constructor(private productService: ProductService) {}

  async viewModel(request: ListGpusRequest, ctx: Context) {
    validate(request, listProductsRequestSchema);

    const query = deepmerge(
      {},
      {
        filter: { productType: ProductType.Gpu },
        pagination: {
          offset: DEFAULT_LIST_GPUS_OFFSET,
          limit: DEFAULT_LIST_GPUS_LIMIT,
        },
        orderBy: {
          sort: ListSort.PerformanceRating,
        },
      } as ListGpusQuery,
      request.query,
    );

    const userSettings = ctx.config?.userSettings;
    const preferredBenchmark = getPreferredBenchmark(
      userSettings,
      ProductType.Gpu,
    );
    const response = await this.productService.list(
      { query },
      {
        fields: ['releaseDate', 'marketSegment', 'msrp'],
        includeBenchmarks: [preferredBenchmark],
      },
      ctx,
    );

    return response;
  }
}
