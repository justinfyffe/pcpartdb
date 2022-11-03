import { Product } from '@shared/product';
import { ProductImages } from '@shared/product-image';
import { ImageCache } from './image-cache';

class ProductCacheImpl {
  private cache = new Map<number, Product>();

  get(id: number) {
    return this.cache.get(id) ?? null;
  }

  save(products: Product | Product[]) {
    if (Array.isArray(products)) {
      products.forEach((product) => {
        this.cache.set(product.id, product);
        this.saveImages(product.images || null);
      });
      return;
    }

    this.cache.set(products.id, products);
    this.saveImages(products.images);
  }

  private saveImages(productImages: ProductImages) {
    const images = [
      productImages?.autocomplete,
      productImages?.thumbnail,
      ...(productImages?.details ?? []),
    ]
      .filter(
        (productImage) => productImage != null && productImage.image != null,
      )
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
