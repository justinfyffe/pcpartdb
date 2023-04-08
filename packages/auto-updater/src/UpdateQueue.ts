import * as fsPromises from 'fs/promises';

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

  async next() {
    if (this.queue == null || this.queue.length === 0) {
      await this.buildQueue();
    }

    return this.queue.shift() || null;
  }

  async save() {
    await fsPromises.writeFile(this.file, JSON.stringify(this.queue), 'utf-8');
  }

  async load() {
    this.queue = JSON.parse(await fsPromises.readFile(this.file, 'utf-8'));
  }

  private async buildQueue() {}
}
