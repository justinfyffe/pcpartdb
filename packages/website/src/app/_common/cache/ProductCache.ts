'use client';

import { Image, Product, ProductType } from '@pcpartdb/shared';
import { useContext } from 'react';
import { CacheContext } from './CacheProvider';
import { ImageCache } from './ImageCache';

export type ProductCacheState = Record<
  string,
  Record<number, Partial<Product>>
>;

class ProductCacheImpl {
  private caches: ProductCacheState = {
    [ProductType.Cpu]: {},
    [ProductType.Gpu]: {},
  };

  get(productType: ProductType, id: number) {
    const cache = this.getCache(productType);
    return cache[id] ?? null;
  }

  save(...productsToSave: (Partial<Product> | Partial<Product>[])[]) {
    productsToSave
      .filter((products) => products != null)
      .forEach((products) => {
        if (Array.isArray(products)) {
          products
            .filter((product) => product != null)
            .forEach((product) => {
              const cache = this.getCache(product.productType);
              cache[product.id!] = product;
              this.saveImages(product);

              if (product.parent != null) {
                cache[product.parent.id!] = product.parent;
                this.saveImages(product.parent);
              }
            });
        } else {
          const cache = this.getCache(products.productType);
          cache[products.id!] = products;
          this.saveImages(products);

          if (products.parent != null) {
            cache[products.parent.id!] = products.parent;
            this.saveImages(products.parent);
          }
        }
      });
  }

  delete(productType: ProductType, id: number) {
    const cache = this.getCache(productType);
    delete cache[id];
  }

  hydrate(state: ProductCacheState) {
    this.save(Object.values(state[ProductType.Cpu]));
    this.save(Object.values(state[ProductType.Gpu]));
  }

  toObject() {
    return this.caches;
  }

  private saveImages(product: Partial<Product>) {
    if ('images' in product && product.images!.length > 0) {
      const images = product
        .images!.map((image) => image.image)
        .filter((image) => image != null) as Image[];
      ImageCache.save(images);
    }
  }

  private getCache(productType: ProductType) {
    return this.caches[productType] ?? null;
  }
}

export const ProductCache = new ProductCacheImpl();

export function useProductCache(
  productType?: ProductType,
  ...products: (Partial<Product> | Partial<Product>[])[]
) {
  const productCache = useContext(CacheContext).getProductCache();
  if (productType == null) {
    return productCache;
  }

  const filtered = products.filter((product) => product != null);
  if (filtered.length > 0) {
    productCache.save(...filtered);
  }

  return productCache;
}
