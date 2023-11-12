import { Config, Store } from 'cache-manager';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import Heap from 'heap-js';
import * as path from 'path';
import * as zlib from 'zlib';

interface FileCacheItem {
  rawKey: string;
  hashKey: string;
  filePath: string;
  expires: number;
  size: number;
}

export interface FileHashStoreConfig extends Config {
  path?: string;
  subDirs?: boolean;
  zip?: boolean;
  maxItems?: number;
}

export class FileHashStore implements Store {
  private config: FileHashStoreConfig;
  private totalSize: number;
  private totalItems: number;
  private items: Record<string, FileCacheItem>;
  private pq = new Heap<{ hashKey: string; expires: number }>(
    (a, b) => a.expires - b.expires,
  );

  constructor(config: FileHashStoreConfig) {
    this.config = {
      path: config.path,
      ttl: config.ttl ? config.ttl : 0,
      subDirs: config.subDirs || false,
      zip: config.zip || false,
      maxItems: config.maxItems || Infinity,
    };

    // Clear existing cache data
    if (fs.existsSync(this.config.path)) {
      fs.rmSync(this.config.path, { recursive: true, force: true });
    }
    fs.mkdirSync(this.config.path, { recursive: true });

    this.totalItems = 0;
    this.totalSize = 0;
    this.items = {};
  }

  getTotalItems() {
    return this.pq.size();
  }

  getTotalSize() {
    return this.totalSize;
  }

  async set<T>(rawKey: string, value: T, ttl?: number) {
    const hashKey = this.getHashKey(rawKey);
    const filePath = this.getFilePathByKey(rawKey);

    await this.writeData(filePath, value);

    const ttlMs = ttl ?? this.config.ttl;
    const expires = Date.now() + ttlMs;
    const size = (await fsPromises.stat(filePath)).size;
    const item: FileCacheItem = { rawKey, hashKey, filePath, expires, size };

    this.setItem(item);
  }

  async get<T>(rawKey: string) {
    const hashKey = this.getHashKey(rawKey);
    const item = this.items[hashKey];

    // Item must exist
    if (item == null) {
      return undefined;
    }

    // Cannot be expired
    if (item.expires <= Date.now()) {
      return undefined;
    }

    // Key must match
    if (item.rawKey !== rawKey) {
      return undefined;
    }

    // All good, read the data
    try {
      const data = await this.readData(item.filePath);
      return data as T;
    } catch (e) {
      // Error occurred, treat is as cache miss.
      console.error(`Error fetching cache: ${rawKey}`);
      console.error(e);
      return undefined;
    }
  }

  async del(key: string) {
    const hashKey = this.getHashKey(key);
    await this.clearItem(hashKey);
  }

  async reset(): Promise<void> {
    this.totalItems = 0;
    this.totalSize = 0;
    this.items = {};
    this.pq.clear();

    await fsPromises.rm(this.config.path, { recursive: true, force: true });
    await fsPromises.mkdir(this.config.path);
  }

  async mset(args: [string, unknown][], ttl?: number) {
    for (const arg of args) {
      await this.set(arg[0], arg[1], ttl);
    }
  }

  async mget(...args: string[]) {
    const results: unknown[] = [];
    for (const arg of args) {
      results.push(await this.get(arg));
    }
    return results;
  }

  async mdel(...args: string[]) {
    for (const arg of args) {
      await this.del(arg);
    }
  }

  async ttl(key: string) {
    const hashKey = this.getHashKey(key);
    if (this.items[hashKey] == null) {
      return undefined;
    }

    return this.items[hashKey].expires - Date.now();
  }

  async keys(_pattern?: string): Promise<string[]> {
    return Object.keys(this.items);
  }

  async clearExcessAndExpired() {
    while (this.pq.peek() != null) {
      const next = this.pq.peek();

      if (next.expires > Date.now() && this.pq.size() <= this.config.maxItems) {
        // Not expiring, and less than max items.
        break;
      }

      const item = this.items[next.hashKey];
      if (item != null && next.expires === item.expires) {
        await this.clearItem(next.hashKey);
      }

      this.pq.pop();
    }
  }

  private async setItem(item: FileCacheItem) {
    const existingItem = this.items[item.hashKey];
    if (existingItem == null) {
      this.totalItems += 1;
    } else {
      this.totalSize -= existingItem.size;
    }

    this.totalSize += item.size;
    this.items[item.hashKey] = item;

    this.pq.push({ hashKey: item.hashKey, expires: item.expires });
  }

  private async clearItem(hashKey: string) {
    const existingItem = this.items[hashKey];
    if (existingItem != null) {
      this.items[hashKey] = null;
      this.totalItems -= 1;
      this.totalSize -= existingItem.size;

      if (fs.existsSync(existingItem.filePath)) {
        await fsPromises.unlink(existingItem.filePath);
      }
    }
  }

  private async readData(filePath: string) {
    // Read data from file.
    const jsonRaw = await fsPromises.readFile(filePath, 'utf-8');
    let json: string;
    if (this.config.zip) {
      json = await new Promise((resolve, reject) =>
        zlib.inflate(Buffer.from(jsonRaw, 'base64'), (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.toString('utf-8'));
        }),
      );
    } else {
      json = jsonRaw;
    }

    // Parse data from file
    const data = JSON.parse(json, (k, v) => {
      if (v && v.type === 'Infinity' && typeof v.sign === 'number') {
        return Infinity * v.sign;
      } else {
        return v;
      }
    });

    return data;
  }

  private async writeData(filePath: string, value: unknown) {
    // Check for directory that will hold the file.
    if (this.config.subDirs) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Stringify data that will be saved
    let dataToSave: Buffer | string = JSON.stringify(value, (k, v) => {
      if (v === Infinity || v === -Infinity) {
        return { type: 'Infinity', sign: Math.sign(v) };
      } else {
        return v;
      }
    });

    // Compress data to reduce storage size
    if (this.config.zip) {
      dataToSave = await new Promise((resolve, reject) =>
        zlib.deflate(dataToSave, (err, result) => {
          if (err) {
            reject(err);
          }

          resolve(result.toString('base64'));
        }),
      );
    }

    // Write file path for item
    await fsPromises.writeFile(filePath, dataToSave, 'utf-8');
  }

  private getHashKey(key: string) {
    return crypto.createHash('md5').update(`${key}`).digest('hex');
  }

  private getFilePathByKey(key: string) {
    const hash = this.getHashKey(key);

    const ext = this.config.zip ? 'json.gz' : 'json';
    if (this.config.subDirs) {
      return path.join(
        this.config.path,
        `cache-${hash.substring(0, 2)}`,
        `${hash}.${ext}`,
      );
    } else {
      return path.join(this.config.path, `cache-${hash}.${ext}`);
    }
  }
}

export function createFileHashStore(config: FileHashStoreConfig & Config) {
  return new FileHashStore(config);
}
