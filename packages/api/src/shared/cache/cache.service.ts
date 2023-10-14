import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import deterministicStringify from 'json-stringify-deterministic';

export enum CacheType {
  CpusList = 'cpus_list',
  CpuProduct = 'cpu_product',
  CpuComparison = 'cpu_comparison',
  CpuStats = 'cpu_stats',

  GpusList = 'gpus_list',
  GpuProduct = 'gpu_product',
  GpuComparison = 'gpu_comparison',
  GpuStats = 'gpu_stats',
}

export const CACHE_EXPIRE_TTLS: Record<CacheType, number> = {
  [CacheType.CpusList]: 1000 * 60 * 5, // 5 minutes
  [CacheType.CpuProduct]: 1000 * 60 * 5, // 5 minutes
  [CacheType.CpuComparison]: 1000 * 60 * 5, // 5 minutes
  [CacheType.CpuStats]: 1000 * 60 * 5, // 5 minutes

  [CacheType.GpusList]: 1000 * 60 * 5, // 5 minutes
  [CacheType.GpuProduct]: 1000 * 60 * 5, // 5 minutes
  [CacheType.GpuComparison]: 1000 * 60 * 5, // 5 minutes
  [CacheType.GpuStats]: 1000 * 60 * 5, // 5 minutes
};

interface CacheOptions<TKey = unknown> {
  type: CacheType;
  key: TKey;
  ttl?: number;
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async cache<TResult = unknown>(
    fn: () => Promise<TResult>,
    options: CacheOptions,
  ) {
    const ttl = options.ttl ?? CACHE_EXPIRE_TTLS[options.type];
    const key = this.cacheKey(options.type, options.key);
    return await this.cacheManager.wrap(key, fn, ttl);
  }

  async invalidateAll() {
    await this.cacheManager.reset();
  }

  private cacheKey<TKey = unknown>(type: CacheType, key: TKey) {
    const stringifiedKey = deterministicStringify(key);
    return crypto
      .createHash('sha1')
      .update(`${type}__${stringifiedKey}`)
      .digest('hex');
  }
}
