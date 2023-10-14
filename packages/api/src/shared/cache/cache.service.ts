import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

export enum CacheType {
  GpusList = 'gpus_list',
  GpuComparison = 'gpu_comparison',
}

export const CACHE_TTLS: Record<CacheType, number> = {
  [CacheType.GpusList]: 1000 * 60 * 5, // 5 minutes
  [CacheType.GpuComparison]: 1000 * 60 * 5, // 5 minutes
};

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    //
  }

  async get<T = unknown>(type: CacheType, key: string) {
    const result: T = await this.cacheManager.get(this.cacheKey(type, key));
    return result ?? null;
  }

  async set<T = unknown>(
    type: CacheType,
    key: string,
    value: T,
    overrideTtlMs?: number,
  ) {
    const cacheKey = this.cacheKey(type, key);
    const ttl = overrideTtlMs ?? CACHE_TTLS[type];
    await this.cacheManager.set(cacheKey, value, ttl);
  }

  async invalidate(type: CacheType, key: string) {
    await this.cacheManager.del(this.cacheKey(type, key));
  }

  async invalidateAll() {
    await this.cacheManager.reset();
  }

  private cacheKey(type: CacheType, key: string) {
    return `${type}__${key}`;
  }
}
