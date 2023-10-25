import { Injectable } from '@nestjs/common';
import {
  mapToAutomationSourceDtos,
  mapToAutomationSourceEntity,
} from '@pcpartdb/database';
import {
  ApplyAutomationSourcesToProductRequest,
  applyAutomationSourcesToProductRequestSchema,
  AutocompleteAutomationSourcesRequest,
  autocompleteAutomationSourcesRequestSchema,
  AutocompleteAutomationSourcesResponse,
  AutomationSource,
  ListAutomationSourceGroupsResponse,
  ListAutomationSourcesRequest,
  listAutomationSourcesRequestSchema,
  UpsertAutomationSourcesRequest,
  upsertAutomationSourcesRequestSchema,
} from '@pcpartdb/shared';
import { ProductService } from '../product/product.service';
import { Context } from '../shared/context';
import { validate } from '../shared/validation/validate';
import { AutomationSourceRepository } from './automation-source.repository';

@Injectable()
export class AutomationSourceService {
  constructor(
    private sourceRepository: AutomationSourceRepository,
    private productService: ProductService,
  ) {}

  /**
   * Return a list of automation sources, grouped together based on product type
   * and source name.
   */
  async listGroups(request: ListAutomationSourcesRequest, ctx: Context) {
    validate(request, listAutomationSourcesRequestSchema);
    const { query } = request;

    const { results, total } = await this.sourceRepository.listGroups(
      { query },
      ctx,
    );

    const groups: AutomationSource[][] = [];
    for (const result of results) {
      const group = await mapToAutomationSourceDtos(result);
      groups.push(group);
    }

    return {
      query,
      results: groups,
      total,
    } as ListAutomationSourceGroupsResponse;
  }

  /**
   * Returns a list of sources, filtered based on the query string.
   */
  async autocomplete(
    request: AutocompleteAutomationSourcesRequest,
    ctx: Context,
  ) {
    validate(request, autocompleteAutomationSourcesRequestSchema);
    const entities = await this.sourceRepository.autocomplete(
      {
        productType: request.productType,
        sourceKey: request.source,
        query: request.query ?? '',
      },
      ctx,
    );
    const sources = await mapToAutomationSourceDtos(entities);

    return { sources } as AutocompleteAutomationSourcesResponse;
  }

  /**
   * Upserts a list of automation sources.
   */
  async upsert(request: UpsertAutomationSourcesRequest, ctx: Context) {
    validate(request, upsertAutomationSourcesRequestSchema);
    const sources = request.sources;
    for (let i = 0; i < sources.length; ++i) {
      const source = sources[i];
      if (request.autoArchive) {
        const archive = await this.sourceRepository.isSourceUsed(
          source.sourceKey,
          source.sourceUrl,
          ctx,
        );
        source.archived = archive || source.archived;
      }

      const entity = await mapToAutomationSourceEntity(source);
      await this.sourceRepository.upsert(entity, ctx);
    }
  }

  /**
   * Sets the sources on the product.
   */
  async applyToProduct(
    request: ApplyAutomationSourcesToProductRequest,
    ctx: Context,
  ) {
    validate(request, applyAutomationSourcesToProductRequestSchema);
    const { productId, sources } = request;
    const entities = await this.sourceRepository.findByIds(sources, ctx);
    const automationSources = await mapToAutomationSourceDtos(entities);

    // Update product
    await this.productService.applyAutomationSources(
      { productId, sources: automationSources },
      ctx,
    );

    automationSources.forEach((source) => {
      source.archived = true;
    });

    // Archive sources
    await this.upsert({ sources: automationSources }, ctx);
  }
}
