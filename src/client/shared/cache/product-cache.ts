import { CacheContext, ImageCache } from '@client/shared/cache';
import { Product } from '@shared/product';
import { ProductImages } from '@shared/product-image';
import { useContext } from 'react';

class ProductCacheImpl {
  private cache = new Map<number, Product>();

  get(id: number) {
    return this.cache.get(id) ?? null;
  }

  save(...productsToSave: (Product | Product[])[]) {
    productsToSave.forEach((products) => {
      if (Array.isArray(products)) {
        products.forEach((product) => {
          this.cache.set(product.id, product);
          this.saveImages(product.images || null);
        });
      } else {
        this.cache.set(products.id, products);
        this.saveImages(products.images);
      }
    });
  }

  private saveImages(productImages: ProductImages) {
    const images = [
      productImages?.autocomplete,
      productImages?.thumbnail,
      ...(productImages?.details ?? []),
    ]
      .filter((productImage) => productImage?.image != null)
      .map((productImage) => productImage.image!);

    ImageCache.save(images);
  }

  delete(id: number) {
    this.cache.delete(id);
  }

  hydrate(products: Record<number, Product>) {
    this.save(Object.values(products));
  }

  toObject() {
    return Object.fromEntries(this.cache);
  }
}

export const ProductCache = new ProductCacheImpl();

export function useProductCache(...products: (Product | Product[])[]) {
  const { productCache } = useContext(CacheContext);
  if (products.length > 0) {
    productCache.save(...products);
  }

  return productCache;
}
