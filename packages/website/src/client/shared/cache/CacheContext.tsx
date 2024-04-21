import { createContext } from 'react';
import { GameCache } from './GameCache';
import { ImageCache } from './ImageCache';
import { ProductCache } from './ProductCache';

interface CacheContextState {
  getGameCache: () => typeof GameCache;
  getProductCache: () => typeof ProductCache;
  getImageCache: () => typeof ImageCache;
}

export const CacheContext = createContext<CacheContextState>({
  getGameCache: () => GameCache,
  getProductCache: () => ProductCache,
  getImageCache: () => ImageCache,
});
