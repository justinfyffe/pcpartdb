import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import * as fsPromises from 'fs/promises';
import deterministicStringify from 'json-stringify-deterministic';
import * as path from 'path';
import { dataPath } from '../utils';

export enum CacheType {
  Home = 'home',

  CpuProduct = 'cpu_product',
  CpuComparison = 'cpu_comparison',

  GpuProduct = 'gpu_product',
  GpuComparison = 'gpu_comparison',
}

const FIFTEEN_MINUTES = 1_000 * 60 * 15;
const SIXTY_MINUTES = 1_000 * 60 * 60;

export const CACHE_EXPIRE_TTLS: Record<CacheType, number> = {
  [CacheType.Home]: SIXTY_MINUTES,

  [CacheType.CpuProduct]: SIXTY_MINUTES,
  [CacheType.CpuComparison]: SIXTY_MINUTES,

  [CacheType.GpuProduct]: SIXTY_MINUTES,
  [CacheType.GpuComparison]: SIXTY_MINUTES,
};

interface CacheOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
  ttl?: number;
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async size() {
    const cacheFiles = await this.getCacheFiles(dataPath('cache'));
    let totalSize = 0;
    for (const cacheFile of cacheFiles) {
      const stats = await fsPromises.stat(cacheFile);
      totalSize += stats.size;
    }
    return totalSize;
  }

  async cache<TResult = unknown>(
    fn: () => Promise<TResult>,
    options: CacheOptions,
  ) {
    if (process.env.ENABLE_CACHE === 'false') {
      // Bypass cache
      return await fn();
    }

    const ttl = options.ttl ?? CACHE_EXPIRE_TTLS[options.type];
    const key = this.cacheKey(options.type, options.key);
    return await this.cacheManager.wrap(
      key,
      () => {
        return fn();
      },
      ttl,
    );
  }

  async invalidateAll() {
    await this.cacheManager.reset();
  }

  private cacheKey<TKey = unknown>(type: CacheType, key: TKey) {
    const stringifiedKey = deterministicStringify(key);
    return crypto
      .createHash('md5')
      .update(`${type}__${stringifiedKey}`)
      .digest('hex');
  }

  private async getCacheFiles(basePath: string, foundFiles?: string[]) {
    const files = await fsPromises.readdir(basePath);

    let cacheFiles = foundFiles || [];
    for (const file of files) {
      const cachePath = path.join(basePath, file);
      const fileStats = await fsPromises.stat(cachePath);
      if (fileStats.isDirectory()) {
        cacheFiles = await this.getCacheFiles(cachePath, cacheFiles);
      } else {
        cacheFiles.push(cachePath);
      }
    }

    return cacheFiles;
  }
}
