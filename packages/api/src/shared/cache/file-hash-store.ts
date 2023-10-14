import { Cache, Config, Store } from 'cache-manager';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as zlib from 'zlib';

export interface FileHashStore extends Store {}

export type FileHashCache = Cache<FileHashStore>;

export interface FileHashStoreConfig extends Config {
  path?: string;
  subDirs?: boolean;
  zip?: boolean;
}

interface FileHashStoreData<T = unknown> {
  expires: number;
  key: string;
  value: T;
}

export class FileHashStore implements Store {
  private config: FileHashStoreConfig;

  constructor(config: FileHashStoreConfig) {
    this.config = {
      path: config.path,
      ttl: config.ttl ? config.ttl : 0,
      subDirs: config.subDirs || false,
      zip: config.zip || false,
    };

    if (!fs.existsSync(this.config.path)) {
      fs.mkdirSync(this.config.path, { recursive: true });
    }
  }

  async set<T>(key: string, value: T, ttl?: number) {
    const filePath = this.getFilePathByKey(key);
    const ttlMs = ttl ?? this.config.ttl;
    const data: FileHashStoreData = {
      expires: Date.now() + ttlMs,
      key,
      value,
    };

    if (this.config.subDirs) {
      // Check if subdirectory exists. Create if it doesn't.
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Write to file
    let dataToSave: Buffer | string = JSON.stringify(data, (k, v) => {
      if (v === Infinity || v === -Infinity) {
        return { type: 'Infinity', sign: Math.sign(v) };
      } else {
        return v;
      }
    });

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

    await fsPromises.writeFile(filePath, dataToSave, 'utf-8');
  }

  async get<T>(key: string) {
    const filePath = this.getFilePathByKey(key);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    try {
      // Read data from file.
      const data = await this.readFile(filePath);
      if (data === undefined) {
        return undefined;
      }

      // Check if key matches
      if (data.key !== key) {
        return undefined;
      }

      // Check if data expired.
      if (data.expires <= Date.now()) {
        return undefined;
      }

      return data.value as T;
    } catch (e) {
      // Error occurred, treat is as cache miss.
      console.error(`Error fetching cache: ${key}`);
      console.error(e);
      return undefined;
    }
  }

  async del(key: string) {
    const filePath = this.getFilePathByKey(key);
    await fsPromises.unlink(filePath);
  }

  async reset(): Promise<void> {
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
    const filePath = this.getFilePathByKey(key);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    const data = await this.readFile(filePath);
    return data.expires - Date.now();
  }

  private async readFile(filePath: string) {
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
    const data: FileHashStoreData = JSON.parse(json, (k, v) => {
      if (v && v.type === 'Infinity' && typeof v.sign === 'number') {
        return Infinity * v.sign;
      } else {
        return v;
      }
    });

    return data;
  }

  private getFilePathByKey(key: string) {
    const hash = crypto.createHash('md5').update(`${key}`).digest('hex');

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
