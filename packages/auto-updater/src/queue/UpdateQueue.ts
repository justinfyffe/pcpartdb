import { Transaction } from '@pcpartdb/database';
import * as fsPromises from 'fs/promises';

export interface UpdateQueueOptions {
  file: string;
}

export abstract class UpdateQueue<T> {
  protected queue: T[];
  protected file: string;
  private loaded = false;

  constructor(options: UpdateQueueOptions) {
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
    this.queue = JSON.parse(await fsPromises.readFile(this.file, 'utf-8'));
    this.loaded = true;
  }

  protected abstract buildQueue(trx: Transaction): void;
}
