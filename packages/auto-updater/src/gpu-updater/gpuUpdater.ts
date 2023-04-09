import {
  mapToDataUpdateEntity,
  mapToGpuDto,
  Transaction,
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
import { dataPath } from '../shared/file';
import { GpuUpdateQueue } from './GpuUpdateQueue';

const GPU_QUEUE_FILE = dataPath('gpu-queue.json');

export async function gpuUpdater(trx: Transaction) {
  // const queue = new GpuUpdateQueue({
  //   file: GPU_QUEUE_FILE,
  // });

  // // Pull next gpu from the queue.
  // const { gpuId } = await queue.next(trx);
  const gpuId = 261;

  // Get gpu from from db
  const entity = await trx.gpu.findUnique({
    where: { id: gpuId },
    include: { specs: true, benchmarks: true },
  });
  const gpu = mapToGpuDto(entity, { includeSources: true });
  if (gpu == null) {
    // Cannot find GPU, skip.
    return;
  }

  // Pull from data sources
  const scrapeResults = await scrapeGpu({
    dataSources: gpu.meta?.dataSources ?? {},
    proxy: true,
  });

  if (scrapeResults.gpu == null) {
    // No scrape results, skip.
    return;
  }

  // Merge existing gpu with scraped data. Exclude auto-update disabled fields.
  const filteredMerge = (target: unknown, source: unknown) => {
    const field = target as GpuField;

    // Auto-updating is disabled. Skip merging.
    if (field?.meta?.autoUpdate === false) {
      return target;
    }

    return deepmerge(target, source, { customMerge: () => filteredMerge });
  };
  const updatedGpu = deepmerge(gpu, scrapeResults.gpu, {
    customMerge: () => filteredMerge,
  });

  // Create diff
  const diff = generateDiff(gpu, updatedGpu);
  console.log(diff);

  // Check if there is an existing pending diff.
  // If there is, delete it and add new one.
  // const totalPendingUpdatesForGpu = await trx.dataUpdate.count({
  //   where: { gpuId: gpu.id, status: DataUpdateStatus.Pending },
  // });
  // if (totalPendingUpdatesForGpu > 0) {
  //   await trx.dataUpdate.deleteMany({
  //     where: { gpuId: gpu.id, status: DataUpdateStatus.Pending },
  //   });
  // }

  // // Save diff into database
  // const dataUpdate: DataUpdate = {
  //   gpuId: gpu.id,
  //   description: `${diff.length} changes detected for ${gpu.name}.`,
  //   status: DataUpdateStatus.Pending,
  //   updateSource: DataUpdateSource.AutoUpdater,
  //   diff: diff,
  //   metadata: {},
  // };
  // const dataUpdateEntity = mapToDataUpdateEntity(dataUpdate);
  // const { gpu: _gpu, decisionUser: _decisionUser, ...data } = dataUpdateEntity;
  // await trx.dataUpdate.create({ data });
}
