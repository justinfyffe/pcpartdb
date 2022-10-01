import Head from 'next/head';
import React, { FunctionComponent } from 'react';
import { Image } from '../../../types/image';
import { Product } from '../../../types/product';
import { ImageCache } from './image-cache';
import { ProductCache } from './product-cache';

interface CacheState {
  images: Record<number, Image>;
  products: Record<number, Product>;
}

export const CacheHydration: FunctionComponent = () => {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('cache');
    if (el != null) {
      const state: CacheState = JSON.parse(el.textContent);
      ImageCache.hydrate(state.images);
      ProductCache.hydrate(state.products);
    }

    return <React.Fragment />;
  } else {
    const state: CacheState = {
      images: ImageCache.toObject(),
      products: ProductCache.toObject(),
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
