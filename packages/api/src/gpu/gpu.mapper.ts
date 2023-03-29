import { Gpu, GpuDataSource, GpuMeta } from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { GpuEntity, GpuMetaJson } from './gpu.entity';
import {
  mapToGpuBenchmarksDto,
  mapToGpuBenchmarksEntity,
} from './gpu-benchmarks.mapper';
import { mapToGpuFieldDto, mapToGpuFieldEntity } from './gpu-field.mapper';
import { mapToGpuImageDtos, mapToGpuImageEntities } from './gpu-image.mapper';
import { mapToGpuSpecsDto, mapToGpuSpecsEntity } from './gpu-specs.mapper';

interface MapToDtoOptions {
  fields?: Set<string>;
  includeSources?: boolean;
}

export function mapToGpuDto(entity: GpuEntity, options?: MapToDtoOptions): Gpu {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    parentId: entity.parentId,
    slug: entity.slug,

    name: entity.name,
    affiliateUrl: entity.affiliateUrl,

    company: mapToGpuFieldDto(entity, 'company', options),
    marketSegment: mapToGpuFieldDto(entity, 'marketSegment', options),
    launchPrice: mapToGpuFieldDto(entity, 'launchPrice', options),
    releaseDate: mapToGpuFieldDto(entity, 'releaseDate', options),

    meta: mapToGpuMetaDto(entity.metadata as GpuMetaJson, options),

    parent: mapToGpuDto(entity.parent, options),
    specs: mapToGpuSpecsDto(entity.specs, options),
    benchmarks: mapToGpuBenchmarksDto(entity.benchmarks, options),
    images: mapToGpuImageDtos(entity.images),
  };
}

export function mapToGpuDtos(
  entities: GpuEntity[],
  options?: MapToDtoOptions,
): Gpu[] {
  return entities.map((entity) => mapToGpuDto(entity, options));
}

function mapToGpuMetaDto(metaJson: GpuMetaJson, options?: MapToDtoOptions) {
  let dataSources = {};

  // Don't include sources unless explicitly specified
  if (options?.includeSources) {
    dataSources = Object.keys(metaJson?.dataSources ?? {}).reduce(
      (acc, key) => {
        acc[key] = metaJson.dataSources[key];
        return acc;
      },
      {} as Record<string, GpuDataSource>,
    );
  }

  return { dataSources } as GpuMeta;
}

export function mapToGpuEntity(gpu: Partial<Gpu>): GpuEntity {
  if (gpu == null) {
    return null;
  }

  const metadata = mapToGpuMetaEntity(gpu.meta);

  const mappedFields: Partial<GpuEntity> = {
    company: mapToGpuFieldEntity(gpu, 'company', metadata),
    marketSegment: mapToGpuFieldEntity(gpu, 'marketSegment', metadata),
    launchPrice: mapToGpuFieldEntity(gpu, 'launchPrice', metadata),
    releaseDate: mapToGpuFieldEntity(gpu, 'releaseDate', metadata),
  };

  return {
    ...mappedFields,

    id: undefined,
    parentId: gpu.parentId,

    slug: gpu.slug,
    name: gpu.name,
    affiliateUrl: gpu.affiliateUrl,

    metadata: metadata as Prisma.JsonObject,

    parent: mapToGpuEntity(gpu.parent),
    specs: mapToGpuSpecsEntity(gpu.specs),
    benchmarks: mapToGpuBenchmarksEntity(gpu.benchmarks),
    images: mapToGpuImageEntities(gpu.images),
  } as GpuEntity;
}

function mapToGpuMetaEntity(meta: GpuMeta) {
  if (meta == null) {
    return {};
  }

  const dataSources = Object.keys(meta.dataSources ?? {}).reduce((acc, key) => {
    acc[key] = meta.dataSources[key];
    return acc;
  }, {} as Record<string, GpuDataSource>);

  return { dataSources, fields: {} } as GpuMetaJson;
}
