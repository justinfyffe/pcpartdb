import {
  DataUpdateRepository,
  GpuRepository,
  mapToDataUpdateEntity,
  mapToGpuDto,
} from '@pcpartdb/database';
import { scrapeGpu } from '@pcpartdb/scraper';
import {
  DataUpdateSource,
  DataUpdateStatus,
  GpuField,
  ProductDataUpdate,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { getDatabase } from '../shared/database';
import { GpuUpdateQueue } from './GpuUpdateQueue';
import { gpuUpdaterDataPath } from './utils';

const GPU_QUEUE_FILE = gpuUpdaterDataPath('gpu-queue.json');

export async function updateNextGpu() {
  const db = await getDatabase();
  const gpuRepository = new GpuRepository(db);
  const dataUpdateRepository = new DataUpdateRepository(db);

  const queue = new GpuUpdateQueue({
    file: GPU_QUEUE_FILE,
  });

  // Get gpu and chipset from from db
  const gpuResult = await db.transaction(async (trx) => {
    const ctx = { trx };

    // Pull next gpu from the queue.
    const { gpuId } = await queue.next(trx);

    const gpuEntity = await gpuRepository.findById(
      gpuId,
      { includeChipset: true },
      ctx,
    );
    return mapToGpuDto(gpuEntity, { includeSources: true });
  });
  if (gpuResult == null) {
    return;
  }
  const { chipset, ...gpu } = gpuResult;

  // Pull from data sources
  const scrapeResults = await scrapeGpu({
    sources: gpu.meta?.dataSources ?? {},
    chipset,
  });

  // Check if we have any results from scraping. Skip if we don't.
  if (scrapeResults.product == null) {
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
  const updatedGpu = deepmerge(gpu, scrapeResults.product, {
    customMerge: () => filteredMerge,
  });

  // Create diff. Skip if there aren't any.
  const jsonPatch = generateJsonPatch(gpu, updatedGpu);
  if (jsonPatch.length === 0) {
    return;
  }

  // Delete existing pending diffs and save new diff.
  await db.transaction(async (trx) => {
    const ctx = { trx };

    // Reject existing pending diffs
    const pendingUpdatesForGpu = await dataUpdateRepository.list({
      gpuId: gpu.id,
      status: DataUpdateStatus.Pending,
    });
    for (const update of pendingUpdatesForGpu) {
      await dataUpdateRepository.update(
        update.id,
        { status: DataUpdateStatus.Rejected, decisionMadeAt: new Date() },
        ctx,
      );
    }

    // Save Data Update
    const dataUpdate: ProductDataUpdate = {
      gpuId: gpu.id,
      description: `${jsonPatch.length} changes detected for ${gpu.name}.`,
      status: DataUpdateStatus.Pending,
      updateSource: DataUpdateSource.AutoUpdater,
      data: { original: gpu, updated: updatedGpu },
      metadata: {},
    };
    const dataUpdateEntity = await mapToDataUpdateEntity(dataUpdate);
    await dataUpdateRepository.create(dataUpdateEntity, ctx);
  });
}
