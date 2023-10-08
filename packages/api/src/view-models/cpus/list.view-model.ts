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
import { ProductService } from '../../product/product.service';
import { Context } from '../../shared/context';
import { validate } from '../../shared/validation/validate';

@Injectable()
export class ListCpusViewModelService {
  constructor(private productService: ProductService) {}

  async viewModel(request: ListCpusRequest, ctx: Context) {
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

    const response = await this.productService.list(
      {
        productType: ProductType.Cpu,
        query: cpusQuery,
      },
      {
        fields: ['releaseDate', 'performanceRating', 'performancePerMsrp'],
      },
      ctx,
    );

    return response;
  }
}
