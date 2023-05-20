import { GpuRepository, mapToGpuDto, mapToGpuEntity } from '@pcpartdb/database';
import { ListGpusOrder, ListGpusSort } from '@pcpartdb/shared';
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
            pagination: { offset: i, limit: 1 },
            orderBy: { sort: ListGpusSort.Id, order: ListGpusOrder.Asc },
          },
        },
        ctx,
      );
      const gpuEntity = gpus[0];
      const gpu = mapToGpuDto(gpuEntity, { includeSources: true });
      const data = mapToGpuEntity(gpu);
      await gpuRepository.update(gpu.id, data, ctx);
    });
  }
}
