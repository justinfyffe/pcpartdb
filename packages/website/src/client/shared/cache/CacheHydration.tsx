import Script from 'next/script';
import React, { FunctionComponent } from 'react';
import { GameCacheState, useGameCache } from './GameCache';
import { ImageCacheState, useImageCache } from './ImageCache';
import { ProductCacheState, useProductCache } from './ProductCache';

interface CacheState {
  images: ImageCacheState;
  products: ProductCacheState;
  games: GameCacheState;
}

export const CacheHydration: FunctionComponent = () => {
  const imageCache = useImageCache();
  const productCache = useProductCache();
  const gameCache = useGameCache();

  if (typeof document !== 'undefined') {
    const el = document.getElementById('cache');
    if (el != null) {
      const state: CacheState = JSON.parse(el.textContent);
      imageCache.hydrate(state.images);
      productCache.hydrate(state.products);
      gameCache.hydrate(state.games);
    }

    return <React.Fragment />;
  } else {
    const state: CacheState = {
      images: imageCache.toObject(),
      products: productCache.toObject(),
      games: gameCache.toObject(),
    };
    return (
      <Script
        id="cache"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(state) }}
      />
    );
  }
};
