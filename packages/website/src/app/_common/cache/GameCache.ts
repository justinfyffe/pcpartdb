import { Game, ProductGame } from '@pcpartdb/shared';
import { useContext } from 'react';
import { CacheContext } from './CacheProvider';
import { ImageCache } from './ImageCache';

interface UseGameCacheOptions {
  games?: Partial<Game>[];
  productGames?: ProductGame[];
}

interface SaveOptions {
  games?: Partial<Game>[];
  productGames?: ProductGame[];
}

export type GameCacheState = Record<number, Partial<Game>>;

class GameCacheImpl {
  private cache: GameCacheState = {};

  get(id: number) {
    return this.cache[id] ?? null;
  }

  save(options?: SaveOptions) {
    const { games: gamesToSave, productGames: productGamesToSave } =
      options ?? {};
    const cache = this.cache;

    gamesToSave
      ?.filter((games) => games != null)
      .forEach((games) => {
        if (Array.isArray(games)) {
          games
            .filter((game) => game != null)
            .forEach((game) => {
              cache[game.id] = game;
              this.saveImages(game);
            });
        } else {
          cache[games.id] = games;
          this.saveImages(games);
        }
      });

    productGamesToSave
      ?.filter((productGames) => productGames != null)
      .forEach((productGames) => {
        if (Array.isArray(productGames)) {
          productGames
            .filter((pg) => pg.game?.id != null)
            .forEach((pg) => {
              cache[pg.game.id] = pg.game;
              this.saveImages(pg.game);
            });
        } else if (productGames.game?.id) {
          cache[productGames.game.id] = productGames.game;
          this.saveImages(productGames.game);
        }
      });
  }

  delete(id: number) {
    const cache = this.cache;
    delete cache[id];
  }

  hydrate(state: GameCacheState) {
    this.cache = state;
  }

  toObject() {
    return this.cache;
  }

  private saveImages(game: Partial<Game>) {
    if (game?.listingImage) {
      ImageCache.save(game.listingImage);
    }
  }
}

export const GameCache = new GameCacheImpl();

export function useGameCache(options?: UseGameCacheOptions) {
  const gameCache = useContext(CacheContext).getGameCache();
  if (options?.games?.length || options?.productGames?.length) {
    gameCache.save(options);
  }

  return gameCache;
}
