import { schema } from 'normalizr';
import { Image, imageSchema } from './image';

export enum ProductImageType {
  Thumbnail = 'THUMBNAIL',
  Autocomplete = 'AUTOCOMPLETE',
  Details = 'DETAILS',
}

export interface ProductImage {
  id?: number;

  type: ProductImageType;
  productId?: number;
  imageId: number;

  image?: Image;
}

export interface ProductImageRequest {
  imageId: number;
  type: ProductImageType;
}

export const productImageSchema = new schema.Entity('productImages', {
  image: imageSchema,
});
