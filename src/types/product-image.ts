import Joi from '@hapi/joi';
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
  type: ProductImageType;
  imageId: number;

  metadata?: ProductImageMetadata;

  image?: Image;
}

export interface ProductImageRequest {
  imageId: number;
  type: ProductImageType;

  metadata?: ProductImageMetadata;
}

export const productImageValidator = Joi.object({
  type: Joi.string().required(),
  imageId: Joi.number().required(),

  metadata: Joi.any(),
}).options({ abortEarly: false });
