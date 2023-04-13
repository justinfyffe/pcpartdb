import { Transaction } from '@pcpartdb/database';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

export interface GpuUpdateQueueOptions {
  file: string;
}

interface GpuQueueData {
  gpuId: number;
}

export class GpuUpdateQueue {
  protected queue: GpuQueueData[];
  protected file: string;
  private loaded = false;

  constructor(options: GpuUpdateQueueOptions) {
    this.file = options.file;
    this.queue = [];
  }

  async next(trx: Transaction) {
    if (!this.loaded) {
      await this.load();
    }

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
    if (fs.existsSync(this.file)) {
      this.queue = JSON.parse(await fsPromises.readFile(this.file, 'utf-8'));
    } else {
      this.queue = [];
    }

    this.loaded = true;
  }

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
