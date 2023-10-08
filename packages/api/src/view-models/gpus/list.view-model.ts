import { Injectable } from '@nestjs/common';
import {
  deepmerge,
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  ListGpusQuery,
  ListGpusRequest,
  listProductsRequestSchema,
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
    const query = request.query;

    const chipsetsQuery = deepmerge(
      {},
      {
        filter: { isChipset: true, isRetailModel: false },
        pagination: {
          offset: DEFAULT_LIST_GPUS_OFFSET,
          limit: DEFAULT_LIST_GPUS_LIMIT,
        },
      } as ListGpusQuery,
      query,
    );

    const response = await this.productService.list(
      {
        productType: ProductType.Gpu,
        query: chipsetsQuery,
      },
      {
        fields: ['releaseDate', 'performanceRating', 'performancePerMsrp'],
        includeAdditionalData: true,
      },
      ctx,
    );

    return response;
  }
}
