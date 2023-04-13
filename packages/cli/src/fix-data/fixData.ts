import { GpuRepository, mapToGpuDto, mapToGpuEntity } from '@pcpartdb/database';
import {
  Gpu,
  GpuBenchmarks,
  GpuField,
  GpuOrder,
  GpuSort,
  GpuSpecs,
} from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function fixData() {
  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  await db.transaction(async (trx) => {
    const ctx = { trx };

    const limit = 50;
    const totalGpus = await gpuRepository.count({}, ctx);

    for (let i = 0; i < totalGpus; i += limit) {
      const gpus = await gpuRepository.list(
        {
          query: {
            offset: i,
            limit,
            orderBy: { sort: GpuSort.Id, order: GpuOrder.Asc },
          },
        },
        ctx,
      );

      for (let j = 0; j < gpus.length; ++j) {
        const gpu = mapToGpuDto(gpus[j], { includeSources: true });
        fixGpu(gpu);
        const data = mapToGpuEntity(gpu);
        await gpuRepository.update(gpu.id, data, ctx);
      }
    }
  });
}

function fixGpu(gpu: Gpu) {
  Object.keys(gpu).forEach((key) => {
    const value = gpu[key as keyof Gpu];
    fixFieldMeta(value as GpuField);
  });

  fixSpecs(gpu.specs);
  fixBenchmarks(gpu.benchmarks);
}

function fixSpecs(obj: GpuSpecs) {
  Object.keys(obj).forEach((key) => {
    const spec = obj[key as keyof GpuSpecs];
    fixFieldMeta(spec as GpuField);
  });
}

function fixBenchmarks(obj: GpuBenchmarks) {
  Object.keys(obj).forEach((key) => {
    const spec = obj[key as keyof GpuBenchmarks];
    fixFieldMeta(spec as GpuField);
  });
}

function fixFieldMeta(field: GpuField) {
  if (field?.meta?.dataSource == null) {
    return;
  }

  field.meta.source = field.meta.dataSource.source;
  field.meta.autoUpdate = field.meta.dataSource.enabled;
  delete field.meta.dataSource;
}
