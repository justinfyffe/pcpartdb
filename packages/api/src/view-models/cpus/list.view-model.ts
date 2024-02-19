import { Injectable } from '@nestjs/common';
import {
  deepmerge,
  DEFAULT_LIST_CPUS_LIMIT,
  DEFAULT_LIST_CPUS_OFFSET,
  getPreferredBenchmark,
  ListCpusQuery,
  ListCpusRequest,
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
export class ListCpusViewModelService {
  constructor(private db: Database, private productService: ProductService) {}

  async viewModel(request: ListCpusRequest, ctx: Context) {
    const timer = `ListCpusViewModelService (${uuid.v4()})`;
    console.time(timer);
    validate(request, listProductsRequestSchema);
    const query = request.query;

    const cpusQuery = deepmerge(
      {},
      {
        filter: { productType: ProductType.Cpu },
        pagination: {
          offset: DEFAULT_LIST_CPUS_OFFSET,
          limit: DEFAULT_LIST_CPUS_LIMIT,
        },
        orderBy: {
          sort: ListSort.Name,
        },
      } as ListCpusQuery,
      query,
    );

    const userSettings = ctx.config?.userSettings;
    const preferredBenchmark = getPreferredBenchmark(
      userSettings,
      ProductType.Cpu,
    );
    const response = await this.productService.list(
      { query: cpusQuery },
      {
        fields: ['marketSegment', 'releaseDate', 'msrp'],
        includeBenchmarks: [preferredBenchmark],
        includeRanks: [preferredBenchmark],
      },
      ctx,
    );
    console.timeEnd(timer);

    return response;
  }
}
