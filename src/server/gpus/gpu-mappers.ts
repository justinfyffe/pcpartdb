import { Gpu } from '@shared/gpus';
import {
  mapToGpuBenchmarksDto,
  mapToGpuBenchmarksEntity,
} from './gpu-benchmarks-mapper';
import { GpuEntity } from './gpu-entity';
import { mapToGpuImageDtos } from './gpu-image-mapper';
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
    metadata: entity.metadata,

    parent: mapToGpuDto(entity.parent),
    specs: mapToGpuSpecsDto(entity.specs),
    benchmarks: mapToGpuBenchmarksDto(entity.benchmarks),
    images: mapToGpuImageDtos(entity.images),
  };
}

export function mapToGpuDtos(entities: GpuEntity[]): Gpu[] {
  return entities.map((entity) => mapToGpuDto(entity));
}

export function mapToGpuEntity(entity: Partial<Gpu>): GpuEntity {
  if (entity == null) {
    return null;
  }

  return {
    id: undefined,
    parentId: entity.parentId,

    slug: entity.slug,
    name: entity.name,
    affiliateUrl: entity.affiliateUrl,
    metadata: entity.metadata,

    parent: mapToGpuEntity(entity.parent),
    specs: mapToGpuSpecsEntity(entity.specs),
    benchmarks: mapToGpuBenchmarksEntity(entity.benchmarks),
    images: null,
  };
}
