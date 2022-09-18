import { schema } from 'normalizr';
import { Image, imageSchema } from './image';

export enum ProductImageType {
  Thumbnail = 'THUMBNAIL',
  Autocomplete = 'AUTOCOMPLETE',
  Details = 'DETAILS',
}

export interface ProductImage {
  productId?: number;
  imageId: number;
  type: ProductImageType;

  image?: Image;
}

export interface ProductImageRequest {
  imageId: number;
  type: ProductImageType;
}

export const productImageSchema = new schema.Entity('productImages', {
  image: imageSchema,
});
