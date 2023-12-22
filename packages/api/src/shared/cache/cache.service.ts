import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import deterministicStringify from 'json-stringify-deterministic';

export enum CacheType {
  Home = 'home',

  CpuProduct = 'cpu_product',
  CpuComparison = 'cpu_comparison',
  BestCpuProduct = 'best_cpu_product',

  GpuProduct = 'gpu_product',
  GpuComparison = 'gpu_comparison',
  GpuRetailModels = 'gpu_retail_models',
  BestGpuProduct = 'best_gpu_product',
}

const FIFTEEN_MINUTES = 1_000 * 60 * 15;
const SIXTY_MINUTES = 1_000 * 60 * 60;

export const CACHE_EXPIRE_TTLS: Partial<Record<CacheType, number>> = {
  [CacheType.Home]: SIXTY_MINUTES,

  [CacheType.CpuProduct]: SIXTY_MINUTES,
  [CacheType.CpuComparison]: SIXTY_MINUTES,
  [CacheType.BestGpuProduct]: FIFTEEN_MINUTES,

  [CacheType.GpuProduct]: SIXTY_MINUTES,
  [CacheType.GpuComparison]: SIXTY_MINUTES,
  [CacheType.GpuRetailModels]: SIXTY_MINUTES,
  [CacheType.BestCpuProduct]: FIFTEEN_MINUTES,
};

interface NoMaxItemsCacheItem {
  item: unknown;
  expires?: number;
}

interface CacheOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
  ttl?: number;
  excludeFromMaxItems?: boolean;
}

@Injectable()
export class CacheService {
  private noMaxItemsCache: Record<string, NoMaxItemsCacheItem> = {};

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async totalItems() {
    return (await this.cacheManager.store.keys()).length;
  }

  async cache<TResult = unknown>(
    fn: () => Promise<TResult>,
    options: CacheOptions,
  ) {
    if (process.env.ENABLE_CACHE === 'false') {
      // Bypass cache
      return await fn();
    }

    if (options.excludeFromMaxItems) {
      return await this.wrapNoMaxItemsCache(fn, options);
    }

    // Cache using cache manager (max items)
    const ttl = options.ttl ?? CACHE_EXPIRE_TTLS[options.type];
    const key = this.cacheKey(options.type, options.key);
    return await this.cacheManager.wrap(key, () => fn(), ttl);
  }

  async invalidateAll() {
    this.noMaxItemsCache = {};
    await this.cacheManager.reset();
  }

  private cacheKey<TKey = unknown>(type: CacheType, key: TKey) {
    if (typeof key === 'string') {
      return `${type}__${key}`;
    }

    const stringifiedKey = deterministicStringify(key);
    return crypto
      .createHash('md5')
      .update(`${type}__${stringifiedKey}`)
      .digest('hex');
  }

  private async wrapNoMaxItemsCache<TResult = unknown>(
    fn: () => Promise<TResult>,
    options: CacheOptions,
  ) {
    const ttl = options.ttl ?? CACHE_EXPIRE_TTLS[options.type];
    const key = this.cacheKey(options.type, options.key);

    const currentTime = new Date().getTime();
    const existingItem = this.noMaxItemsCache[key] ?? null;

    // Check if existing item is still valid.
    if (
      existingItem != null &&
      (existingItem.expires == null || existingItem.expires > currentTime)
    ) {
      return existingItem.item;
    }

    // Existing item expired or doesn't exist. Cache it.
    const item = await fn();
    this.noMaxItemsCache[key] = {
      item,
      expires: ttl != null ? currentTime + ttl : null,
    };
    return item;
  }
}
