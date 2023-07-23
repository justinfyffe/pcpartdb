import { Injectable } from '@nestjs/common';
import {
  mapToProductSourceDtos,
  mapToProductSourceEntity,
} from '@pcpartdb/database';
import {
  ApplyProductSourcesToProductRequest,
  ArchiveProductSourcesRequest,
  AutocompleteProductSourcesRequest,
  AutocompleteProductSourcesResponse,
  CreateProductSourcesRequest,
  ListProductSourcesQuery,
  ProductSourceGroup,
  ProductType,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError } from '../shared/error';
import { CpuService } from './cpu/cpu.service';
import { ProductSourceRepository } from './product-source.repository';

interface ListGroupsOptions {
  query: ListProductSourcesQuery;
}

interface CountGroupsOptions {
  query: ListProductSourcesQuery;
}

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
  async listGroups(options: ListGroupsOptions, ctx: Context) {
    const productType = options.query.filter?.productType;
    const sourceNames = await this.repository.groupBySourceName(options, ctx);

    // Set up groups to populate
    const groups = new Map<string, ProductSourceGroup>();
    for (const sourceName of sourceNames) {
      groups.set(sourceName.toLowerCase(), []);
    }

    const entities = await this.repository.findBySourceNames(
      { productType, sourceNames },
      ctx,
    );
    const sources = mapToProductSourceDtos(entities);
    for (const source of sources) {
      const key = source.sourceName.toLowerCase();
      groups.get(key).push(source);
    }

    return [...groups.values()];
  }

  /**
   * Returns the total number of product source groups, grouped together based
   * on product type and source name.
   */
  async countGroups(options: CountGroupsOptions, ctx: Context) {
    return await this.repository.countSourceNames(options, ctx);
  }

  /**
   * Returns a list of sources, filtered based on the query string.
   */
  async autocomplete(request: AutocompleteProductSourcesRequest, ctx: Context) {
    const entities = await this.repository.autocomplete(
      { productType: request.productType, query: request.query ?? '' },
      ctx,
    );
    const sources = mapToProductSourceDtos(entities);

    return { sources } as AutocompleteProductSourcesResponse;
  }

  /**
   * Upserts a list of product sources.
   */
  async upsert(request: CreateProductSourcesRequest, ctx: Context) {
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
    const { productType, productId, sources: idsAndArchive } = request;

    const ids = idsAndArchive.map((source) => source.id);

    const entities = await this.repository.findByIds(ids, ctx);
    const productSources = mapToProductSourceDtos(entities);

    // Update product
    if (productType === ProductType.Cpu) {
      await this.cpuService.applySources(productId, productSources, ctx);
    } else if (productType === ProductType.Gpu) {
      // TODO
    } else {
      throw badRequestError({
        property: 'productType',
        constraint: ValidationErrorType.InvalidProductType,
      });
    }

    // Enqueue action to update product
    // Call automation queue service to do this.

    // Archive sources that we want to archive
    const idsToArchive = idsAndArchive
      .filter((source) => source.archive)
      .map((source) => source.id);
    await this.archive({ sources: idsToArchive }, ctx);
  }

  async archive(request: ArchiveProductSourcesRequest, ctx: Context) {
    const { sources: ids } = request;

    for (const id of ids) {
      await this.repository.archive(id, ctx);
    }
  }
}
