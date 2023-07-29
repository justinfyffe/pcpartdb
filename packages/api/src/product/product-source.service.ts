import { Injectable } from '@nestjs/common';
import {
  mapToProductSourceDtos,
  mapToProductSourceEntity,
} from '@pcpartdb/database';
import {
  ApplyProductSourcesToProductRequest,
  AutocompleteProductSourcesRequest,
  AutocompleteProductSourcesResponse,
  ListProductSourceGroupsResponse,
  ListProductSourcesRequest,
  ProductType,
  UpsertProductSourcesRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { CpuService } from './cpu/cpu.service';
import { listProductSourcesRequestValidator } from './product.validators';
import { ProductSourceRepository } from './product-source.repository';

@Injectable()
export class ProductSourceService {
  constructor(
    private repository: ProductSourceRepository,
    private cpuService: CpuService,
  ) {}

  /**
   * Return a list of product sources, grouped together based on product type
   * and source name.
   */
  async listGroups(request: ListProductSourcesRequest, ctx: Context) {
    validate(request, listProductSourcesRequestValidator);
    const { query } = request;

    const { results, total } = await this.repository.listGroups({ query }, ctx);

    return {
      query,
      results: results.map((result) => mapToProductSourceDtos(result)),
      total,
    } as ListProductSourceGroupsResponse;
  }

  /**
   * Returns a list of sources, filtered based on the query string.
   */
  async autocomplete(request: AutocompleteProductSourcesRequest, ctx: Context) {
    const entities = await this.repository.autocomplete(
      {
        productType: request.productType,
        sourceKey: request.source,
        query: request.query ?? '',
      },
      ctx,
    );
    const sources = mapToProductSourceDtos(entities);

    return { sources } as AutocompleteProductSourcesResponse;
  }

  /**
   * Upserts a list of product sources.
   */
  async upsert(request: UpsertProductSourcesRequest, ctx: Context) {
    const sources = request.sources;
    for (let i = 0; i < sources.length; ++i) {
      const source = sources[i];
      const entity = await mapToProductSourceEntity(source);
      await this.repository.upsert(entity, ctx);
    }
  }

  async applyToProduct(
    request: ApplyProductSourcesToProductRequest,
    ctx: Context,
  ) {
    const { productType, productId, sources } = request;

    const entities = await this.repository.findByIds(sources, ctx);
    const productSources = mapToProductSourceDtos(entities);

    // Update product
    if (productType === ProductType.Cpu) {
      await this.cpuService.applySources(productId, productSources, ctx);
    } else if (productType === ProductType.Gpu) {
      // TODO: Update GPU
    } else {
      throw badRequestError({
        property: 'productType',
        constraint: ValidationErrorType.InvalidProductType,
      });
    }
  }
}
