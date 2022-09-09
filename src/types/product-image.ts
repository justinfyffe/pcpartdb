import { schema } from 'normalizr';
import { Image, imageSchema } from './image';

export enum ProductImageType {
  Thumbnail = 'THUMBNAIL',
  Autocomplete = 'AUTOCOMPLETE',
  Details = 'DETAILS',
}

export interface ProductImageMetadata {
  order?: number;
}

export interface ProductImage {
  id?: number;

  type: ProductImageType;
  productId?: number;
  imageId: number;

  metadata: ProductImageMetadata;

  image?: Image;
}

export interface ProductImageRequest {
  imageId: number;
  type: ProductImageType;

  metadata?: ProductImageMetadata;
}

export const productImageSchema = new schema.Entity('productImages', {
  image: imageSchema,
});
