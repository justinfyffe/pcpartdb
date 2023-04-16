import { GpuRepository, mapToGpuDto, mapToGpuEntity } from '@pcpartdb/database';
import {
  populatePerformanceScoreBenchmark,
  populateValueScoreBenchmark,
} from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function refreshRatings() {
  console.log('Refreshing ratings');

  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);

  await db.transaction(async (trx) => {
    const ctx = { trx };

    const gpus = await gpuRepository.listAll({}, ctx);

    console.log(`Fetched ${gpus.length} gpus`);

    for (let i = 0; i < gpus.length; ++i) {
      const gpu = mapToGpuDto(gpus[i], { includeSources: true });
      populatePerformanceScoreBenchmark(gpu);
      populateValueScoreBenchmark(gpu);

      const data = mapToGpuEntity(gpu);
      await gpuRepository.update(gpu.id, data, ctx);
    }
  });
}
