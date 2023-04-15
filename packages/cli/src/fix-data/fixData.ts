import {
  GpuRepository,
  mapToGpuBenchmarksDto,
  mapToGpuDto,
  mapToGpuEntity,
  mapToGpuSpecsDto,
} from '@pcpartdb/database';
import {
  Gpu,
  GpuBenchmarks,
  GpuOrder,
  GpuSort,
  GpuSpecs,
} from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function fixData() {
  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  const totalGpus = await db.transaction(async (trx) => {
    const ctx = { trx };
    return await gpuRepository.count({}, ctx);
  });

  for (let i = 0; i < totalGpus; ++i) {
    await db.transaction(async (trx) => {
      const ctx = { trx };

      const gpus = await gpuRepository.list(
        {
          query: {
            offset: i,
            limit: 1,
            orderBy: { sort: GpuSort.Id, order: GpuOrder.Asc },
          },
        },
        ctx,
      );

      const gpuEntity = gpus[0];
      const specsEntity = await trx.gpuSpecs.findUnique({
        where: { gpuId: gpuEntity.id },
      });
      const benchmarksEntity = await trx.gpuBenchmarks.findUnique({
        where: { gpuId: gpuEntity.id },
      });

      const gpu = mapToGpuDto(gpuEntity, { includeSources: true });
      const specs = mapToGpuSpecsDto(specsEntity, {
        includeSources: true,
      });
      const benchmarks = mapToGpuBenchmarksDto(benchmarksEntity, {
        includeSources: true,
      });

      const result = fixGpu(gpu, specs, benchmarks);
      const data = mapToGpuEntity(result);
      await gpuRepository.update(result.id, data, ctx);
    });
  }
}

function fixGpu(gpu: Gpu, specs: GpuSpecs, benchmarks: GpuBenchmarks) {
  let result = { ...gpu };
  result = migrateSpecs(result, specs);
  result = migrateBenchmarks(result, benchmarks);
  return result;
}

function migrateSpecs(gpu: Gpu, specs: GpuSpecs) {
  return {
    ...gpu,
    ...specs,
  };
}

function migrateBenchmarks(gpu: Gpu, benchmarks: GpuBenchmarks) {
  return {
    ...gpu,
    ...benchmarks,
  };
}
