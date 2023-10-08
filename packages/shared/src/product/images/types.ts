import { Image } from '../../image';

export interface ProductImage {
  imageId: number;
  productId?: number;

  image?: Image;
}
