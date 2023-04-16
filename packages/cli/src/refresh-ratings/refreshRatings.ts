import { GpuRepository, mapToGpuDto, mapToGpuEntity } from '@pcpartdb/database';
import {
  populatePerformanceScoreBenchmark,
  populateValueScoreBenchmark,
} from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function refreshRatings() {
  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  await db.transaction(async (trx) => {
    const ctx = { trx };

    const gpus = await gpuRepository.listAll({}, ctx);

    for (let j = 0; j < gpus.length; ++j) {
      const gpu = mapToGpuDto(gpus[j], { includeSources: true });
      populatePerformanceScoreBenchmark(gpu);
      populateValueScoreBenchmark(gpu);

      const data = mapToGpuEntity(gpu);
      await gpuRepository.update(gpu.id, data, ctx);
    }
  });
}
