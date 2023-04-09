import { Transaction } from '@pcpartdb/database';
import * as fsPromises from 'fs/promises';
import { getDatabase } from '../shared/database';

interface QueueData {
  gpuId: number;
}

interface UpdateQueueOptions {
  file: string;
}

export class UpdateQueue {
  private queue: QueueData[];
  private file: string;

  constructor(options: UpdateQueueOptions) {
    this.file = options.file;
    this.queue = [];
  }

  async next(trx?: Transaction) {
    if (this.queue == null || this.queue.length === 0) {
      await this.buildQueue(trx);
    }

    const data = this.queue.shift() || null;
    await this.save();
    return data;
  }

  async save() {
    await fsPromises.writeFile(this.file, JSON.stringify(this.queue), 'utf-8');
  }

  async load() {
    this.queue = JSON.parse(await fsPromises.readFile(this.file, 'utf-8'));
  }

  private async buildQueue(trx?: Transaction) {
    const db = trx ?? (await getDatabase());

    // Queue will consist of GPUs, ordered by release date.
    // Null release dates first.
    const gpus = await db.gpu.findMany({
      select: { id: true },
      orderBy: { releaseDate: { sort: 'desc', nulls: 'first' } },
    });

    const gpuIds = gpus.map(({ id }) => id);

    const queueData: QueueData[] = gpuIds.map((gpuId) => ({ gpuId }));
    this.queue = queueData;

    await this.save();
  }
}
