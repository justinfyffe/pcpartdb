import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import deterministicStringify from 'json-stringify-deterministic';
import { FileHashStore } from './file-hash-store';

export enum CacheType {
  Home = 'home',

  CpuProduct = 'cpu_product',
  CpuComparison = 'cpu_comparison',

  GpuProduct = 'gpu_product',
  GpuComparison = 'gpu_comparison',
}

const _FIFTEEN_MINUTES = 1_000 * 60 * 15;
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
  private mutex = new Mutex();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  totalSize() {
    const store = this.cacheManager.store as FileHashStore;
    return store.getTotalSize();
  }

  totalItems() {
    const store = this.cacheManager.store as FileHashStore;
    return store.getTotalItems();
  }

  async cache<TResult = unknown>(
    fn: () => Promise<TResult>,
    options: CacheOptions,
  ) {
    if (process.env.ENABLE_CACHE === 'false') {
      // Bypass cache
      return await fn();
    }

    return await this.mutex.runExclusive(async () => {
      const store = this.cacheManager.store as FileHashStore;
      await store.clearExcessAndExpired();

      const ttl = options.ttl ?? CACHE_EXPIRE_TTLS[options.type];
      const key = this.cacheKey(options.type, options.key);
      return await this.cacheManager.wrap(key, () => fn(), ttl);
    });
  }

  async invalidateAll() {
    await this.mutex.runExclusive(async () => {
      await this.cacheManager.reset();
    });
  }

  private cacheKey<TKey = unknown>(type: CacheType, key: TKey) {
    const stringifiedKey = deterministicStringify(key);
    return crypto
      .createHash('md5')
      .update(`${type}__${stringifiedKey}`)
      .digest('hex');
  }
}
