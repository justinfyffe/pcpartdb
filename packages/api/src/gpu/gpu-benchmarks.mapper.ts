import { GpuBenchmarksEntity, Prisma } from '@pcpartdb/database';
import { GpuBenchmarks } from '@pcpartdb/shared/gpus';
import { mapToGpuFieldDto, mapToGpuFieldEntity } from './gpu-field.mapper';

interface MapToDtoOptions {
  includeSources?: boolean;
}

export function mapToGpuBenchmarksDto(
  entity: GpuBenchmarksEntity,
  options?: MapToDtoOptions,
): GpuBenchmarks {
  if (entity == null) {
    return null;
  }

  return {
    gpuId: entity.gpuId,

    g3dMark: mapToGpuFieldDto(entity, 'g3dMark', options),
    g2dMark: mapToGpuFieldDto(entity, 'g2dMark', options),
    timespyGraphics: mapToGpuFieldDto(entity, 'timespyGraphics', options),
    performanceScore: mapToGpuFieldDto(entity, 'performanceScore', options),
    valueScore: mapToGpuFieldDto(entity, 'valueScore', options),
  };
}

export function mapToGpuBenchmarksEntity(
  benchmarks: Partial<GpuBenchmarks>,
): GpuBenchmarksEntity {
  if (benchmarks == null) {
    return null;
  }

  const metadata = {};

  const mappedBenchmarks: Partial<GpuBenchmarksEntity> = {
    performanceScore: mapToGpuFieldEntity(
      benchmarks,
      'performanceScore',
      metadata,
    ),
    valueScore: mapToGpuFieldEntity(benchmarks, 'valueScore', metadata),
    g3dMark: mapToGpuFieldEntity(benchmarks, 'g3dMark', metadata),
    g2dMark: mapToGpuFieldEntity(benchmarks, 'g2dMark', metadata),
    timespyGraphics: mapToGpuFieldEntity(
      benchmarks,
      'timespyGraphics',
      metadata,
    ),
  };

  return {
    ...mappedBenchmarks,
    gpuId: undefined,
    metadata: metadata as Prisma.JsonObject,
  } as GpuBenchmarksEntity;
}
