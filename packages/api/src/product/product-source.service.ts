import { Injectable } from '@nestjs/common';
import {
  mapToCpuDto,
  mapToGpuDto,
  mapToProductSourceDto,
  mapToProductSourceDtos,
  mapToProductSourceEntity,
} from '@pcpartdb/database';
import {
  ApplyProductSourcesToProductRequest,
  AutocompleteProductSourcesRequest,
  AutocompleteProductSourcesResponse,
  CpuProductSourceGroup,
  GpuProductSourceGroup,
  ListProductSourceGroupsResponse,
  ListProductSourcesRequest,
  ProductSource,
  ProductType,
  UpsertProductSourcesRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { CpuRepository } from './cpu/cpu.repository';
import { CpuService } from './cpu/cpu.service';
import { GpuRepository } from './gpu/gpu.repository';
import { GpuService } from './gpu/gpu.service';
import { listProductSourcesRequestValidator } from './product.validators';
import { ProductSourceRepository } from './product-source.repository';

@Injectable()
export class ProductSourceService {
  constructor(
    private sourceRepository: ProductSourceRepository,
    private cpuRepository: CpuRepository,
    private cpuService: CpuService,
    private gpuRepository: GpuRepository,
    private gpuService: GpuService,
  ) {}

  /**
   * Return a list of product sources, grouped together based on product type
   * and source name.
   */
  async listGroups(request: ListProductSourcesRequest, ctx: Context) {
    validate(request, listProductSourcesRequestValidator);
    const { query } = request;

    const { results, total } = await this.sourceRepository.listGroups(
      { query },
      ctx,
    );

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
    const entities = await this.sourceRepository.autocomplete(
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
      await this.sourceRepository.upsert(entity, ctx);
    }
  }

  /**
   * Sets the sources on the product.
   */
  async applyToProduct(
    request: ApplyProductSourcesToProductRequest,
    ctx: Context,
  ) {
    const { productType, productId, sources } = request;

    const entities = await this.sourceRepository.findByIds(sources, ctx);
    const productSources = mapToProductSourceDtos(entities);

    // Update product
    if (productType === ProductType.Cpu) {
      await this.cpuService.applySources(
        productId,
        productSources as CpuProductSourceGroup,
        ctx,
      );
    } else if (productType === ProductType.Gpu) {
      await this.gpuService.applySources(
        productId,
        productSources as GpuProductSourceGroup,
        ctx,
      );
    } else {
      throw badRequestError({
        property: 'productType',
        constraint: ValidationErrorType.InvalidProductType,
      });
    }
  }

  async autoArchive(ctx: Context) {
    // Pull all products and non-archived sources
    const allCpuEntities = await this.cpuRepository.listAll({}, ctx);
    const allGpuEntities = await this.gpuRepository.listAll({}, ctx);
    const nonArchivedSourceEntities = await this.sourceRepository.listAll(
      { query: { filter: { includeArchived: false } } },
      ctx,
    );

    // Build set of urls that are existing products already use.
    const productSourceUrls = new Set<string>();
    for (const entity of allCpuEntities) {
      const cpu = mapToCpuDto(entity, { includeSources: true });
      for (const dataSource of Object.values(cpu.meta?.dataSources ?? {})) {
        if (dataSource?.url) {
          productSourceUrls.add(dataSource.url);
        }
      }
    }
    for (const entity of allGpuEntities) {
      const gpu = mapToGpuDto(entity, { includeSources: true });
      for (const dataSource of Object.values(gpu.meta?.dataSources ?? {})) {
        if (dataSource?.url) {
          productSourceUrls.add(dataSource.url);
        }
      }
    }

    // Track sources that have a url which is already used on a product.
    // Mark those as archived.
    const sourcesToArchive: ProductSource[] = [];
    for (const entity of nonArchivedSourceEntities) {
      if (productSourceUrls.has(entity.sourceUrl)) {
        const dto = mapToProductSourceDto(entity);
        dto.archived = true;
        sourcesToArchive.push(dto);
      }
    }

    // Save new archived sources.
    await this.upsert({ sources: sourcesToArchive }, ctx);
  }
}
