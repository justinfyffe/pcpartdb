import { Image } from '../../image';

// Types

export interface ProductImage {
  imageId: number;
  productId?: number;

  image?: Image;
}
