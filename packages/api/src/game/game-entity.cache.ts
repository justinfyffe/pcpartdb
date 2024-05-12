import { Injectable } from '@nestjs/common';
import { GameEntity } from '@pcpartdb/database';
import { CacheService, CacheType } from '../shared/cache/cache.service';
import { Context } from '../shared/context';
import { GameRepository } from './game.repository';

interface GetGameByIdOptions extends RelationOptions {
  id: number;
  bypassCache?: boolean;
}

interface GetGameBySlugOptions extends RelationOptions {
  slug: string;
  bypassCache?: boolean;
}

interface GetGamesByIdsOptions extends RelationOptions {
  ids: number[];
  bypassCache?: boolean;
}

interface InvalidateOptions {
  id: number;
}

interface RelationOptions {
  includeRequirements?: boolean;
}

interface GetGameIdsToFetchOptions<TData = unknown> {
  ids: number[];

  cacheType: CacheType;
  onCacheHit?: (id: number, data: TData) => void;
  bypassCache?: boolean;
}

@Injectable()
export class GameEntityCache {
  constructor(
    private cacheService: CacheService,
    private gameRepository: GameRepository,
  ) {}

  async getGameById(options: GetGameByIdOptions, ctx: Context) {
    const games = await this.getGamesByIds(
      { ...options, ids: [options.id] },
      ctx,
    );
    return games?.[0] || null;
  }

  async getGameBySlug(options: GetGameBySlugOptions, ctx: Context) {
    const game = await this.gameRepository.findBySlug2(
      { slug: options.slug },
      ctx,
    );

    if (game == null) {
      return null;
    }

    return await this.getGameById({ ...options, id: game.id }, ctx);
  }

  async getGamesByIds(options: GetGamesByIdsOptions, ctx: Context) {
    // Need to use map to maintain order.
    const gamesMap = new Map<number, GameEntity>();
    for (const id of options.ids) {
      gamesMap.set(id, null);
    }

    const idsToFetch = await this.getGameIdsToFetch<GameEntity>({
      ids: options.ids,
      cacheType: CacheType.Game,
      onCacheHit: (id, game) => {
        gamesMap.set(id, game);
      },
    });

    // Get games that are not in cache, then store them in cache.
    if (idsToFetch.length > 0) {
      const result = await this.gameRepository.findByIds(
        { ids: idsToFetch },
        ctx,
      );

      for (const game of result) {
        gamesMap.set(game.id, game);

        // Add game to the cache.
        const cacheKey = `${game.id}`;
        await this.cacheService.setCached(game, {
          type: CacheType.Game,
          key: cacheKey,
          bypass: options.bypassCache,
        });
      }
    }

    const games = [...gamesMap.values()].filter((val) => val != null);

    // Check if we have games
    if (games.length === 0) {
      return [];
    }

    return games;
  }

  async invalidate(options: InvalidateOptions) {
    const key = `${options.id}`;
    await this.cacheService.invalidate({ type: CacheType.Game, key });
  }

  private async getGameIdsToFetch<TData = unknown>(
    options: GetGameIdsToFetchOptions<TData>,
  ) {
    const cacheType = options.cacheType;
    const bypassCache = options.bypassCache;

    const gameIds = options.ids;
    const idsToFetchSet = new Set<number>(gameIds);

    for (const id of idsToFetchSet) {
      const cacheKey = `${id}`;
      // TODO: use mget?
      const value = await this.cacheService.getCached({
        type: cacheType,
        key: cacheKey,
        shallowClone: true,
        bypass: bypassCache,
      });

      // If we found data in the cache, then call the onCacheHit function
      // and remove the id from the ones that need to be fetched from the database.
      if (value != null) {
        if (options.onCacheHit) {
          options.onCacheHit(id, value as TData);
        }
        idsToFetchSet.delete(id);
      }
    }

    return [...idsToFetchSet.values()];
  }
}
