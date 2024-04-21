'use client';

import { Game, Image, Product, ProductGame } from '@pcpartdb/shared';
import React, { createContext, useContext } from 'react';
import { GameCache } from './GameCache';
import { ImageCache } from './ImageCache';
import { ProductCache } from './ProductCache';

interface CacheContextState {
  getProductCache: () => typeof ProductCache;
  getImageCache: () => typeof ImageCache;
  getGameCache: () => typeof GameCache;
}

export const CacheContext = createContext<CacheContextState>({
  getProductCache: () => ProductCache,
  getImageCache: () => ImageCache,
  getGameCache: () => GameCache,
});

export function useCache() {
  return useContext(CacheContext);
}

export interface CacheProviderProps {
  products?: Product | Product[];
  images?: Image | Image[];
  games?: Game | Game[];
  productGames?: ProductGame | ProductGame[];
  children: React.ReactNode;
}

export function CacheProvider(props: CacheProviderProps) {
  const { products, images, games, productGames } = props;

  if (products) {
    ProductCache.save(products);
  }

  if (images) {
    ImageCache.save(images);
  }

  if (games) {
    GameCache.save({ games: Array.isArray(games) ? games : [games] });
  }

  if (productGames) {
    GameCache.save({
      productGames: Array.isArray(productGames) ? productGames : [productGames],
    });
  }

  return (
    <CacheContext.Provider
      value={{
        getProductCache: () => ProductCache,
        getImageCache: () => ImageCache,
        getGameCache: () => GameCache,
      }}
    >
      {props.children}
    </CacheContext.Provider>
  );
}
