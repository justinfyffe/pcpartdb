import { Product } from '../../../types/product';
import { ProductImage } from '../../../types/product-image';
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
        this.saveImages(product.images ?? []);
      });
      return;
    }

    this.cache.set(products.id, products);
    this.saveImages(products.images ?? []);
  }

  private saveImages(productImages: ProductImage[]) {
    const images = productImages
      .filter((productImage) => productImage.image != null)
      .map((productImage) => productImage.image!);

    ImageCache.save(images);
  }

  delete(id: number) {
    this.cache.delete(id);
  }
}

export const ProductCache = new ProductCacheImpl();
