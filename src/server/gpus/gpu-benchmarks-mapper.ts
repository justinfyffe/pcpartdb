import { Prisma } from '@prisma/client';
import { GpuBenchmark, GpuBenchmarkMeta, GpuBenchmarks } from '@shared/gpus';
import { GpuBenchmarksEntity } from './gpu-entity';

export function mapToGpuBenchmarksDto(
  entity: GpuBenchmarksEntity,
): GpuBenchmarks {
  if (entity == null) {
    return null;
  }

  return {
    gpuId: entity.gpuId,

    g3dMark: mapToGpuBenchmarkDto(entity, 'g3dMark'),
    g2dMark: mapToGpuBenchmarkDto(entity, 'g2dMark'),
    timespyGraphics: mapToGpuBenchmarkDto(entity, 'timespyGraphics'),
    performanceScore: mapToGpuBenchmarkDto(entity, 'performanceScore'),
    valueScore: mapToGpuBenchmarkDto(entity, 'valueScore'),
  };
}

function mapToGpuBenchmarkDto<T>(
  entity: GpuBenchmarksEntity,
  key: keyof GpuBenchmarksEntity,
): GpuBenchmark<T> {
  if (entity[key] == null) {
    return null;
  }

  const metadata = entity.metadata as Prisma.JsonObject;

  return {
    value: entity[key] as T,
    meta: metadata?.[key] as Prisma.JsonObject,
  };
}

export function mapToGpuBenchmarksEntity(
  benchmarks: Partial<GpuBenchmarks>,
): GpuBenchmarksEntity {
  if (benchmarks == null) {
    return null;
  }

  const metadata = {};

  const mappedSpecs = {
    performanceScore: mapToGpuBenchmarkEntity(
      benchmarks,
      'performanceScore',
      metadata,
    ),
    valueScore: mapToGpuBenchmarkEntity(benchmarks, 'valueScore', metadata),
    g3dMark: mapToGpuBenchmarkEntity(benchmarks, 'g3dMark', metadata),
    g2dMark: mapToGpuBenchmarkEntity(benchmarks, 'g2dMark', metadata),
    timespyGraphics: mapToGpuBenchmarkEntity(
      benchmarks,
      'timespyGraphics',
      metadata,
    ),
  };

  return {
    ...mappedSpecs,
    gpuId: undefined,
    metadata: metadata as Prisma.JsonObject,
  };
}

function mapToGpuBenchmarkEntity(
  benchmarks: Partial<GpuBenchmarks>,
  key: keyof GpuBenchmarks,
  metadata: { [col: string]: GpuBenchmarkMeta },
) {
  const benchmark = benchmarks?.[key];
  if (typeof benchmark === 'number') {
    throw new Error(`Cannot map gpu benchmark to entity, key=${key}`);
  }

  metadata[key] = benchmark?.meta ?? null;
  return benchmark?.value ?? null;
}
