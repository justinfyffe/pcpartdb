import { Product, ProductType } from '@pcpartdb/shared';
import { useContext } from 'react';
import { CacheContext, ImageCache } from '../cache';

export type ProductCacheState = Record<string, Record<number, Product>>;

class ProductCacheImpl {
  private caches: ProductCacheState = {
    [ProductType.Cpu]: {},
    [ProductType.Gpu]: {},
  };

  get(productType: ProductType, id: number) {
    const cache = this.getCache(productType);
    return cache[id] ?? null;
  }

  save(productType: ProductType, ...productsToSave: (Product | Product[])[]) {
    const cache = this.getCache(productType);

    productsToSave
      .filter((products) => products != null)
      .forEach((products) => {
        if (Array.isArray(products)) {
          products
            .filter((product) => product != null)
            .forEach((product) => {
              cache[product.id] = product;
              this.saveImages(product);
            });
        } else {
          cache[products.id] = products;
          this.saveImages(products);
        }
      });
  }

  delete(productType: ProductType, id: number) {
    const cache = this.getCache(productType);
    delete cache[id];
  }

  hydrate(state: ProductCacheState) {
    this.save(ProductType.Cpu, Object.values(state[ProductType.Cpu]));
    this.save(ProductType.Gpu, Object.values(state[ProductType.Gpu]));
  }

  toObject() {
    return this.caches;
  }

  private saveImages(product: Product) {
    if ('images' in product && product.images.length > 0) {
      const images = product.images
        .map((image) => image.image)
        .filter((image) => image != null);
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
  ...products: (Product | Product[])[]
) {
  const { productCache } = useContext(CacheContext);
  if (productType == null) {
    return productCache;
  }

  const filtered = products.filter((product) => product != null);
  if (filtered.length > 0) {
    productCache.save(productType, ...filtered);
  }

  return productCache;
}
