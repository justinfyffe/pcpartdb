import { useImageCache, useProductCache } from '@client/shared/cache';
import { Image } from '@shared/image';
import { Product } from '@shared/product';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';

interface CacheState {
  images: Record<number, Image>;
  products: Record<number, Product>;
}

export const CacheHydration: FunctionComponent = () => {
  const productCache = useProductCache();
  const imageCache = useImageCache();

  if (typeof document !== 'undefined') {
    const el = document.getElementById('cache');
    if (el != null) {
      const state: CacheState = JSON.parse(el.textContent);
      imageCache.hydrate(state.images);
      productCache.hydrate(state.products);
    }

    return <React.Fragment />;
  } else {
    const state: CacheState = {
      images: imageCache.toObject(),
      products: productCache.toObject(),
    };
    return (
      <Head>
        <script
          id="cache"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(state) }}
        />
      </Head>
    );
  }
};
