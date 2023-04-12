import { Transaction } from '@pcpartdb/database';
import { UpdateQueue } from '../shared/UpdateQueue';

interface GpuQueueData {
  gpuId: number;
}

export class GpuUpdateQueue extends UpdateQueue<GpuQueueData> {
  // Queue will consist of GPUs, ordered by release date.
  protected async buildQueue(trx: Transaction) {
    // Fetch GPUs by release date. Nulls first
    const gpus = await trx.gpu.findMany({
      select: { id: true },
      orderBy: { releaseDate: { sort: 'desc', nulls: 'first' } },
    });
    const gpuIds = gpus.map(({ id }) => id);

    // Generate queue data.
    const queueData: GpuQueueData[] = gpuIds.map((gpuId) => ({ gpuId }));
    this.queue = queueData;

    // Save queu
    await this.save();
  }
}
