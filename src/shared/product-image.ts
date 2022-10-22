import Joi from '@hapi/joi';
import { Image } from './image';

export enum ProductImageType {
  Thumbnail = 'THUMBNAIL',
  Autocomplete = 'AUTOCOMPLETE',
  Details = 'DETAILS',
}

export interface ProductImageMetadata {
  order?: number;
}

export interface ProductImage {
  type: ProductImageType;
  imageId: number;

  metadata?: ProductImageMetadata;

  image?: Image;
}

export type ProductImageRequest = Omit<ProductImage, 'image'>;

export type ProductImageMap = Partial<Record<ProductImageType, ProductImage[]>>;

export const productImageValidator = Joi.object({
  type: Joi.string().required(),
  imageId: Joi.number().required(),

  metadata: Joi.any(),
}).options({ abortEarly: false });
