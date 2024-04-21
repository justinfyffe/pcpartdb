import {
  BenchmarkKey,
  Product,
  ProductFieldKey,
  ProductFields,
  ProductType,
  RelatedProducts,
} from '@pcpartdb/shared';
import { mapToAutomationSourceDtos } from '../mappers';
import {
  mapToProductBenchmarkDtos,
  mapToProductBenchmarkEntity,
  mapToProductImageDtos,
  mapToProductImageEntity,
  mapToProductSourceDtos,
  mapToProductSourceEntity,
  mapToProductUpdateDtos,
  ProductEntity,
} from '.';
import {
  mapToProductFieldsDto,
  mapToProductFieldsEntity,
} from './productFieldsMapper';
import {
  mapToProductGameDtos,
  mapToProductGameFpsEntities,
} from './productGameMapper';
import { mapToProductRanksDto } from './productRankMapper';

interface MapToDtoOptions {
  fields?: ProductFieldKey[];
  parentFields?: ProductFieldKey[];
  childrenFields?: ProductFieldKey[];
  relatedFields?: ProductFieldKey[];

  includeBenchmarks?: boolean | BenchmarkKey[];
  includeParentBenchmarks?: boolean | BenchmarkKey[];
  includeRelatedBenchmarks?: boolean | BenchmarkKey[];

  includeGames?: boolean | (number | string)[]; // All/No Games or Game IDs or Game Slugs
  includeParentGames?: boolean | (number | string)[]; // All/No Games or Game IDs or Game Slugs
  includeRelatedGames?: boolean | (number | string)[]; // All/No Games or Game IDs or Game Slugs

  includeRanks?: boolean | BenchmarkKey[];
  includeParentRanks?: boolean | BenchmarkKey[];
  includeRelatedRanks?: boolean | BenchmarkKey[];

  includeParent?: boolean;
  includeChildren?: boolean;
  includeAutomation?: boolean;
  includeImages?: boolean;
  includeSources?: boolean;
  includeSummary?: boolean;
  includeUpdates?: boolean;

  includeRelated?: boolean;
}

export async function mapToProductDto(
  entity: ProductEntity,
  options?: MapToDtoOptions,
): Promise<Product> {
  if (entity == null) {
    return null;
  }

  const includeBenchmarks = options?.includeBenchmarks ?? false;
  const includeParentBenchmarks = options?.includeParentBenchmarks ?? false;
  const includeRelatedBenchmarks = options?.includeRelatedBenchmarks ?? false;

  const includeGames = options?.includeGames ?? false;
  const includeParentGames = options?.includeParentGames ?? false;
  const includeRelatedGames = options?.includeRelatedGames ?? false;

  const includeRanks = options?.includeRanks ?? false;
  const includeParentRanks = options?.includeParentRanks ?? false;
  const includeRelatedRanks = options?.includeRelatedRanks ?? false;

  const includeParent = options?.includeParent ?? false;
  const includeChildren = options?.includeChildren ?? false;

  const includeAutomation = options?.includeAutomation ?? false;
  const includeImages = options?.includeImages ?? false;
  const includeSources = options?.includeSources ?? false;
  const includeRelated = options?.includeRelated ?? false;
  const includeSummary = options?.includeSummary ?? false;
  const includeUpdates = options?.includeUpdates ?? false;

  const fields: ProductFields = mapToProductFieldsDto(
    entity.productType as ProductType,
    entity.cpuFields ?? entity.gpuFields,
    options,
  );

  const parent = includeParent
    ? await mapToProductDto(entity.parent, {
        ...options,
        fields: options?.parentFields,
        includeBenchmarks: includeParentBenchmarks,
        includeGames: includeParentGames,
        includeRanks: includeParentRanks,
        includeRelated: includeRelated,
        includeRelatedBenchmarks: includeRelatedBenchmarks,
        includeRelatedGames: includeRelatedGames,
        includeRelatedRanks: includeRelatedRanks,
      })
    : undefined;
  const children = includeChildren
    ? await mapToProductDtos(entity.children, {
        fields: options?.childrenFields,
      })
    : undefined;
  const benchmarks = includeBenchmarks
    ? mapToProductBenchmarkDtos(entity.benchmarks ?? [], options)
    : undefined;
  const games = includeGames
    ? await mapToProductGameDtos(entity.gameFps ?? [], { includeGames })
    : undefined;
  const images = includeImages
    ? mapToProductImageDtos(entity.images ?? [])
    : undefined;
  const ranks = includeRanks
    ? mapToProductRanksDto(entity.ranks, options)
    : undefined;
  const relatedAutomationSources = includeAutomation
    ? await mapToAutomationSourceDtos(entity.relatedAutomationSources ?? [])
    : undefined;
  const sources = includeSources
    ? mapToProductSourceDtos(entity.sources ?? [])
    : undefined;
  const updates = includeUpdates
    ? await mapToProductUpdateDtos(entity.updates ?? [])
    : undefined;

  const relatedProducts: RelatedProducts = [];
  const checkedIds = new Set<number>();
  if (includeRelated) {
    for (const rp of entity?.relatedProducts ?? []) {
      if (!checkedIds.has(rp.relatedProductId)) {
        const relatedProduct = await mapToProductDto(rp.relatedProduct, {
          fields: options?.relatedFields,
          includeBenchmarks: includeRelatedBenchmarks,
          includeGames: includeRelatedGames,
          includeRanks: includeRelatedRanks,
        });
        relatedProducts.push(relatedProduct);
        checkedIds.add(rp.relatedProductId);
      }
    }
  }

  return {
    id: entity.id,
    parentId: entity.parentId,

    productType: entity.productType,
    slug: entity.slug,
    name: entity.name,
    otherNames: entity.otherNames ?? [],
    company: entity.company,
    searchText: entity.searchText,
    affiliateUrl: entity.affiliateUrl,
    summary: includeSummary ? entity.summary : undefined,
    summaryPublishedAt: includeSummary
      ? entity.summaryPublishedAt?.getTime()
      : undefined,
    summaryStale: includeSummary ? entity.summaryStale : undefined,
    enablePerformanceSummary: includeSummary
      ? entity.enablePerformanceSummary
      : undefined,

    metadata: entity.metadata,

    automatedAt: includeAutomation ? entity.automatedAt?.getTime() : undefined,

    fields,
    benchmarks,
    games,
    ranks,
    sources,
    updates,
    images,
    relatedAutomationSources,
    relatedProducts,
    parent,
    children,
  } as Product;
}

export async function mapToProductDtos(
  entities: ProductEntity[],
  options?: MapToDtoOptions,
) {
  if (entities == null) {
    return null;
  }

  const ret = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(await mapToProductDto(entities[i], options));
  }
  return ret;
}

export function mapToProductEntity(dto: Product) {
  if (dto == null) {
    return null;
  }

  const fields = mapToProductFieldsEntity(dto.productType, dto.fields);
  const benchmarks =
    dto.benchmarks?.map((benchmark) =>
      mapToProductBenchmarkEntity(benchmark),
    ) || [];
  const gameFps = mapToProductGameFpsEntities(dto.games);
  const sources =
    dto.sources?.map((source) => mapToProductSourceEntity(source)) || [];
  const images =
    dto.images?.map((image) => mapToProductImageEntity(image)) || [];

  return {
    id: undefined,
    parentId: dto.parentId,

    productType: dto.productType,
    slug: dto.slug,
    name: dto.name,
    otherNames: dto.otherNames,
    company: dto.company,
    searchText: dto.searchText,
    affiliateUrl: dto.affiliateUrl,

    summary: dto.summary,
    summaryPublishedAt:
      dto.summaryPublishedAt != null
        ? new Date(dto.summaryPublishedAt)
        : undefined,
    summaryStale: dto.summaryStale,
    enablePerformanceSummary: dto.enablePerformanceSummary,

    metadata: dto.metadata,

    automatedAt:
      dto.automatedAt != null ? new Date(dto.automatedAt) : undefined,

    cpuFields: dto.productType === ProductType.Cpu ? fields : undefined,
    gpuFields: dto.productType === ProductType.Gpu ? fields : undefined,
    benchmarks,
    gameFps,
    sources,
    images,
  } as ProductEntity;
}
