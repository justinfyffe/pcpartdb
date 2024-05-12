import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { shallowClone } from '@pcpartdb/shared';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import deterministicStringify from 'json-stringify-deterministic';

export enum CacheType {
  // Pages
  Page = 'page',

  // Entity caches
  BaseProduct = 'base_product',
  ProductFields = 'product_fields',
  ProductBenchmarks = 'product_benchmarks',
  ProductGameFps = 'product_game_fps',
  ProductRanks = 'product_ranks',
  ProductImages = 'product_images',
  ProductSources = 'product_sources',
  RelatedProducts = 'related_products',
  Game = 'games',

  BestProduct = 'best_product',
}

const ONE_MINUTE = 1_000 * 60;
const _FIVE_MINUTES = ONE_MINUTE * 5;
const _FIFTEEN_MINUTES = ONE_MINUTE * 15;
const ONE_HOUR = ONE_MINUTE * 60;
const _SIX_HOURS = ONE_HOUR * 6;
const ONE_DAY = ONE_HOUR * 24;

export const CACHE_EXPIRE_TTLS: Partial<Record<CacheType, number>> = {
  [CacheType.Page]: ONE_HOUR,

  // Entity Caches
  [CacheType.BaseProduct]: ONE_DAY,
  [CacheType.ProductFields]: ONE_DAY,
  [CacheType.ProductBenchmarks]: ONE_HOUR,
  [CacheType.ProductGameFps]: ONE_HOUR,
  [CacheType.ProductRanks]: ONE_HOUR,
  [CacheType.ProductImages]: ONE_DAY,
  [CacheType.ProductSources]: ONE_HOUR,
  [CacheType.RelatedProducts]: ONE_DAY,
  [CacheType.Game]: ONE_DAY,

  [CacheType.BestProduct]: ONE_HOUR,
};

interface NoMaxItemsCacheItem {
  item: unknown;
  expires?: number;
  clone?: boolean;
}

interface CacheOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
  ttl?: number;
  excludeFromMaxItems?: boolean;
  shallowClone?: boolean;
  deepClone?: boolean;
  bypass?: boolean;
}

interface IsCachedOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
  bypass?: boolean;
}

interface GetCachedOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
  shallowClone?: boolean;
  deepClone?: boolean;
  bypass?: boolean;
}

interface SetCachedOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
  ttl?: number;
  bypass?: boolean;
}

interface InvalidateOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
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
  ): Promise<TResult> {
    if (process.env.ENABLE_CACHE === 'false' || options.bypass) {
      // Bypass cache
      return await fn();
    }

    if (options.excludeFromMaxItems) {
      return await this.wrapNoMaxItemsCache(fn, options);
    }

    // Cache using cache manager (max items)
    const ttl = options.ttl ?? CACHE_EXPIRE_TTLS[options.type];
    const key = this.cacheKey(options.type, options.key);
    const result = await this.cacheManager.wrap(key, () => fn(), ttl);
    return options.shallowClone ? structuredClone(result) : result;
  }

  async isCached(options: IsCachedOptions) {
    if (process.env.ENABLE_CACHE === 'false' || options.bypass) {
      // Bypass cache
      return false;
    }

    const key = this.cacheKey(options.type, options.key);
    return (await this.cacheManager.get(key)) != null;
  }

  async getCached<TValue = unknown>(options: GetCachedOptions) {
    if (process.env.ENABLE_CACHE === 'false' || options.bypass) {
      // Bypass cache
      return null;
    }

    const key = this.cacheKey(options.type, options.key);
    const result = (await this.cacheManager.get(key)) as TValue;
    if (options.deepClone) {
      return structuredClone(result) as TValue;
    } else if (options.shallowClone) {
      return shallowClone(result) as TValue;
    } else {
      return result;
    }
  }

  async setCached<TValue = unknown>(value: TValue, options: SetCachedOptions) {
    if (process.env.ENABLE_CACHE === 'false' || options.bypass) {
      // Bypass cache
      return;
    }

    const key = this.cacheKey(options.type, options.key);
    await this.cacheManager.set(
      key,
      value,
      options.ttl ?? CACHE_EXPIRE_TTLS[options.type],
    );
  }

  async invalidate(options: InvalidateOptions) {
    const key = this.cacheKey(options.type, options.key);
    delete this.noMaxItemsCache[key];
    await this.cacheManager.del(key);
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
  ): Promise<TResult> {
    const ttl = options.ttl ?? CACHE_EXPIRE_TTLS[options.type];
    const key = this.cacheKey(options.type, options.key);

    const currentTime = new Date().getTime();
    const existingItem = this.noMaxItemsCache[key] ?? null;

    // Check if existing item is still valid.
    if (
      existingItem != null &&
      (existingItem.expires == null || existingItem.expires > currentTime)
    ) {
      return existingItem.item as TResult;
    }

    // Existing item expired or doesn't exist. Cache it.
    const item = await fn();
    this.noMaxItemsCache[key] = {
      item,
      expires: ttl != null ? currentTime + ttl : null,
    };
    if (options.deepClone) {
      return structuredClone(item) as TResult;
    } else if (options.shallowClone) {
      return shallowClone(item) as TResult;
    } else {
      return item;
    }
  }
}
