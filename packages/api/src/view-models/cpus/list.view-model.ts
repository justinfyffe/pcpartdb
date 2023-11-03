import { Injectable } from '@nestjs/common';
import {
  deepmerge,
  DEFAULT_LIST_CPUS_LIMIT,
  DEFAULT_LIST_CPUS_OFFSET,
  ListCpusQuery,
  ListCpusRequest,
  listProductsRequestSchema,
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
        filter: {},
        pagination: {
          offset: DEFAULT_LIST_CPUS_OFFSET,
          limit: DEFAULT_LIST_CPUS_LIMIT,
        },
      } as ListCpusQuery,
      query,
    );

    const response = await this.db.transaction(
      () =>
        this.productService.list(
          {
            productType: ProductType.Cpu,
            query: cpusQuery,
          },
          {
            fields: ['releaseDate', 'performanceRating', 'performancePerMsrp'],
          },
          ctx,
        ),
      { ctx, isolationLevel: 'ReadUncommitted' },
    );
    console.timeEnd(timer);

    return response;
  }
}
