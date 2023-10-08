import {
  CpuFields,
  GpuFields,
  Product,
  ProductFieldKey,
  ProductFields,
  ProductType,
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
  fields?: Set<ProductFieldKey>;
  parentFields?: Set<ProductFieldKey>;
  childrenFields?: Set<ProductFieldKey>;
  includeParent?: boolean;
  includeChildren?: boolean;
  includeBenchmarks?: boolean;
  includeAutomation?: boolean;
  includeSources?: boolean;
  includeUpdates?: boolean;
  includeImages?: boolean;
}

export async function mapToProductDto(
  entity: ProductEntity,
  options?: MapToDtoOptions,
): Promise<Product> {
  if (entity == null) {
    return null;
  }

  const includeParent = options?.includeParent ?? false;
  const includeChildren = options?.includeChildren ?? false;
  const includeBenchmarks = options?.includeBenchmarks ?? false;
  const includeImages = options?.includeImages ?? false;
  const includeSources = options?.includeSources ?? false;
  const includeUpdates = options?.includeUpdates ?? false;
  const includeAutomation = options?.includeAutomation ?? false;

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
  const children = includeChildren
    ? await mapToProductDtos(entity.children, {
        ...options,
        fields: options?.childrenFields,
      })
    : undefined;
  const benchmarks = includeBenchmarks
    ? mapToProductBenchmarkDtos(entity.benchmarks ?? [])
    : undefined;
  const images = includeImages
    ? mapToProductImageDtos(entity.images ?? [])
    : undefined;
  const sources = includeSources
    ? mapToProductSourceDtos(entity.sources ?? [])
    : undefined;
  const updates = includeUpdates
    ? await mapToProductUpdateDtos(entity.updates ?? [])
    : undefined;
  const relatedAutomationSources = includeAutomation
    ? await mapToAutomationSourceDtos(entity.relatedAutomationSources ?? [])
    : undefined;

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

    metadata: entity.metadata,

    automatedAt: includeAutomation ? entity.automatedAt?.getTime() : undefined,

    fields,
    benchmarks,
    sources,
    updates,
    images,
    relatedAutomationSources,
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
