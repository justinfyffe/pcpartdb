import { Prisma } from '@prisma/client';
import { Gpu, GpuDataSourceMeta, GpuMeta } from '@shared/gpus';
import {
  mapToGpuBenchmarksDto,
  mapToGpuBenchmarksEntity,
} from './gpu-benchmarks-mapper';
import { GpuEntity, GpuMetaJson } from './gpu-entity';
import { mapToGpuFieldDto, mapToGpuFieldEntity } from './gpu-field-mapper';
import { mapToGpuImageDtos, mapToGpuImageEntities } from './gpu-image-mapper';
import { mapToGpuSpecsDto, mapToGpuSpecsEntity } from './gpu-specs-mapper';

export function mapToGpuDto(entity: GpuEntity): Gpu {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    parentId: entity.parentId,
    slug: entity.slug,

    name: entity.name,
    affiliateUrl: entity.affiliateUrl,

    company: mapToGpuFieldDto(entity, 'company'),
    marketSegment: mapToGpuFieldDto(entity, 'marketSegment'),
    launchPrice: mapToGpuFieldDto(entity, 'launchPrice'),
    releaseDate: mapToGpuFieldDto(entity, 'releaseDate'),

    meta: mapToGpuMetaDto(entity.metadata as GpuMetaJson),

    parent: mapToGpuDto(entity.parent),
    specs: mapToGpuSpecsDto(entity.specs),
    benchmarks: mapToGpuBenchmarksDto(entity.benchmarks),
    images: mapToGpuImageDtos(entity.images),
  };
}

export function mapToGpuDtos(entities: GpuEntity[]): Gpu[] {
  return entities.map((entity) => mapToGpuDto(entity));
}

function mapToGpuMetaDto(metaJson: GpuMetaJson) {
  const dataSources = Object.keys(metaJson?.dataSources ?? {}).reduce(
    (acc, key) => {
      acc[key] = metaJson.dataSources[key];
      return acc;
    },
    {} as Record<string, GpuDataSourceMeta>,
  );
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
  }, {} as Record<string, GpuDataSourceMeta>);

  return { dataSources, fields: {} } as GpuMetaJson;
}
