import {
  DataUpdateRepository,
  GpuRepository,
  mapToDataUpdateEntity,
  mapToGpuDto,
} from '@pcpartdb/database';
import { scrapeGpu } from '@pcpartdb/scraper';
import {
  DataUpdate,
  DataUpdateSource,
  DataUpdateStatus,
  generateDiff,
  GpuField,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { getDatabase } from '../shared/database';
import { dataPath } from '../shared/file';
import { GpuUpdateQueue } from './GpuUpdateQueue';

const GPU_QUEUE_FILE = dataPath('gpu-queue.json');

export async function gpuUpdater() {
  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);
  const dataUpdateRepository = new DataUpdateRepository(db);

  // const queue = new GpuUpdateQueue({
  //   file: GPU_QUEUE_FILE,
  // });

  const gpuId = 1;

  // Get gpu from from db
  const gpu = await db.transaction(async (trx) => {
    const ctx = { trx };

    // // Pull next gpu from the queue.
    // const { gpuId } = await queue.next(trx);

    const entity = await gpuRepository.findById(gpuId, {}, ctx);
    return mapToGpuDto(entity, { includeSources: true });
  });
  if (gpu == null) {
    return;
  }

  // Pull from data sources
  const scrapeResults = await scrapeGpu({
    dataSources: gpu.meta?.dataSources ?? {},
    proxy: true,
  });

  // Check if we have any results from scraping. Skip if we don't.
  if (scrapeResults.gpu == null) {
    return;
  }

  // Merge existing gpu with scraped data. Exclude auto-update disabled fields.
  const filteredMerge = (target: unknown, source: unknown) => {
    const field = target as GpuField;

    // Auto-updating is disabled. Skip merging.
    if (field?.meta?.autoUpdate != null && field.meta.autoUpdate === false) {
      return target;
    }

    return deepmerge(target, source, { customMerge: () => filteredMerge });
  };
  const updatedGpu = deepmerge(gpu, scrapeResults.gpu, {
    customMerge: () => filteredMerge,
  });

  // Create diff. Skip if there aren't any.
  const diff = generateDiff(gpu, updatedGpu);
  if (diff.length === 0) {
    return;
  }

  // Delete existing pending diffs and save new diff.
  await db.transaction(async (trx) => {
    const ctx = { trx };

    // Delete existing pending diffs
    const pendingUpdatesForGpu = await dataUpdateRepository.listPending({
      gpuId: gpu.id,
    });
    for (const update of pendingUpdatesForGpu) {
      await dataUpdateRepository.delete(update.id, ctx);
    }

    // Save diff
    const dataUpdate: DataUpdate = {
      gpuId: gpu.id,
      description: `${diff.length} changes detected for ${gpu.name}.`,
      status: DataUpdateStatus.Pending,
      updateSource: DataUpdateSource.AutoUpdater,
      diff: diff,
      metadata: {},
    };
    const dataUpdateEntity = mapToDataUpdateEntity(dataUpdate);
    await dataUpdateRepository.create(dataUpdateEntity, ctx);
  });
}
