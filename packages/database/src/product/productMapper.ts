import {
  CpuFields,
  GpuFields,
  Product,
  ProductFieldKey,
  ProductFields,
  ProductType,
  RelatedProducts,
} from '@pcpartdb/shared';
import { mapToAutomationSourceDtos } from '../mappers';
import {
  mapToCpuFieldsDto,
  mapToCpuFieldsEntity,
  mapToGpuFieldsDto,
  mapToGpuFieldsEntity,
  mapToProductBenchmarkDtos,
  mapToProductBenchmarkEntity,
  mapToProductImageDtos,
  mapToProductImageEntity,
  mapToProductSourceDtos,
  mapToProductSourceEntity,
  mapToProductUpdateDtos,
  ProductEntity,
} from '.';

interface MapToDtoOptions {
  fields?: ProductFieldKey[];
  parentFields?: ProductFieldKey[];
  relatedFields?: ProductFieldKey[];

  includeParent?: boolean;

  includeAutomation?: boolean;
  includeBenchmarks?: boolean;
  includeImages?: boolean;
  includeRanks?: boolean;
  includeSources?: boolean;
  includeSummary?: boolean;
  includeUpdates?: boolean;

  includeRelated?: boolean;
  includeRelatedBenchmarks?: boolean;
  includeRelatedRanks?: boolean;
}

export async function mapToProductDto(
  entity: ProductEntity,
  options?: MapToDtoOptions,
): Promise<Product> {
  if (entity == null) {
    return null;
  }

  const includeParent = options?.includeParent ?? false;

  const includeAutomation = options?.includeAutomation ?? false;
  const includeBenchmarks = options?.includeBenchmarks ?? false;
  const includeImages = options?.includeImages ?? false;
  const includeSources = options?.includeSources ?? false;
  const includeRanks = options?.includeRanks ?? false;
  const includeRelated = options?.includeRelated ?? false;
  const includeSummary = options?.includeSummary ?? false;
  const includeUpdates = options?.includeUpdates ?? false;

  let fields: ProductFields;
  switch (entity.productType) {
    case ProductType.Cpu:
      fields = mapToCpuFieldsDto(entity.cpuFields, options);
      break;
    case ProductType.Gpu:
      fields = mapToGpuFieldsDto(entity.gpuFields, options);
      break;
  }

  const parent = includeParent
    ? await mapToProductDto(entity.parent, {
        ...options,
        fields: options?.parentFields,
      })
    : undefined;

  const benchmarks = includeBenchmarks
    ? mapToProductBenchmarkDtos(entity.benchmarks ?? [])
    : undefined;
  const images = includeImages
    ? mapToProductImageDtos(entity.images ?? [])
    : undefined;
  const ranks = includeRanks ? entity.ranks?.ranks : undefined;
  const relatedAutomationSources = includeAutomation
    ? await mapToAutomationSourceDtos(entity.relatedAutomationSources ?? [])
    : undefined;
  const sources = includeSources
    ? mapToProductSourceDtos(entity.sources ?? [])
    : undefined;
  const updates = includeUpdates
    ? await mapToProductUpdateDtos(entity.updates ?? [])
    : undefined;

  let relatedProducts: RelatedProducts = undefined;
  if (includeRelated) {
    relatedProducts = {};
    for (const rp of entity?.relatedProducts ?? []) {
      const key = rp.relatedProductKey;
      relatedProducts[key] = relatedProducts[key] || [];

      const relatedProduct = await mapToProductDto(rp.relatedProduct, {
        fields: options?.relatedFields,
        includeBenchmarks: options?.includeRelatedBenchmarks,
        includeRanks: options?.includeRelatedRanks,
      });
      relatedProducts[key].push(relatedProduct);
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

    metadata: entity.metadata,

    automatedAt: includeAutomation ? entity.automatedAt?.getTime() : undefined,

    fields,
    benchmarks,
    ranks,
    sources,
    updates,
    images,
    relatedAutomationSources,
    relatedProducts,
    parent,
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

  const cpuFields =
    dto.productType === ProductType.Cpu
      ? mapToCpuFieldsEntity(dto.fields as CpuFields)
      : undefined;
  const gpuFields =
    dto.productType === ProductType.Gpu
      ? mapToGpuFieldsEntity(dto.fields as GpuFields)
      : undefined;
  const benchmarks =
    dto.benchmarks?.map((benchmark) =>
      mapToProductBenchmarkEntity(benchmark),
    ) || [];
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

    metadata: dto.metadata,

    automatedAt:
      dto.automatedAt != null ? new Date(dto.automatedAt) : undefined,

    cpuFields,
    gpuFields,
    benchmarks,
    sources,
    images,
  } as ProductEntity;
}
