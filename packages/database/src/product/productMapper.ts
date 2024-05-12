import {
  BenchmarkKey,
  Product,
  ProductFieldKey,
  ProductFields,
  ProductType,
  RelatedProducts,
} from '@pcpartdb/shared';
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
  relatedFields?: ProductFieldKey[];

  includeBenchmarks?: boolean | BenchmarkKey[];
  includeRelatedBenchmarks?: boolean | BenchmarkKey[];

  includeGames?: boolean | (number | string)[]; // All/No Games or Game IDs or Game Slugs
  includeRelatedGames?: boolean | (number | string)[]; // All/No Games or Game IDs or Game Slugs

  includeRanks?: boolean | BenchmarkKey[];
  includeRelatedRanks?: boolean | BenchmarkKey[];

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
  const includeRelatedBenchmarks = options?.includeRelatedBenchmarks ?? false;

  const includeGames = options?.includeGames ?? false;
  const includeRelatedGames = options?.includeRelatedGames ?? false;

  const includeRanks = options?.includeRanks ?? false;
  const includeRelatedRanks = options?.includeRelatedRanks ?? false;

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

  const [games, updates] = await Promise.all([
    includeGames
      ? mapToProductGameDtos(entity.gameFps ?? [], { includeGames })
      : undefined,
    includeUpdates ? mapToProductUpdateDtos(entity.updates ?? []) : undefined,
  ]);

  const benchmarks = includeBenchmarks
    ? mapToProductBenchmarkDtos(entity.benchmarks ?? [], options)
    : undefined;
  const images = includeImages
    ? mapToProductImageDtos(entity.images ?? [])
    : undefined;
  const ranks = includeRanks
    ? mapToProductRanksDto(entity.ranks, options)
    : undefined;
  const sources = includeSources
    ? mapToProductSourceDtos(entity.sources ?? [])
    : undefined;

  let relatedProducts: RelatedProducts = [];
  if (includeRelated) {
    const promises: Promise<Product>[] = [];
    const alreadyMapped = new Set<number>();
    for (const rp of entity?.relatedProducts ?? []) {
      if (!alreadyMapped.has(rp.relatedProductId)) {
        alreadyMapped.add(rp.relatedProductId);
        promises.push(
          mapToProductDto(rp.relatedProduct, {
            fields: options?.relatedFields,
            includeBenchmarks: includeRelatedBenchmarks,
            includeGames: includeRelatedGames,
            includeRanks: includeRelatedRanks,
          }),
        );
      }
    }
    relatedProducts = await Promise.all(promises);
  }

  return {
    id: entity.id,

    productType: entity.productType,
    slug: entity.slug,
    name: entity.name,
    // otherNames: entity.otherNames ?? [],
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
    relatedProducts,
  } as Product;
}

export async function mapToProductDtos(
  entities: ProductEntity[],
  options?: MapToDtoOptions,
) {
  if (entities == null) {
    return null;
  }

  const promises = entities.map((entity) => mapToProductDto(entity, options));
  return await Promise.all(promises);
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
