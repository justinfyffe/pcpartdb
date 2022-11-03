import Joi from '@hapi/joi';
import { Image } from './image';

export interface ProductImages {
  thumbnail?: ProductImage;
  autocomplete?: ProductImage;
  details?: ProductImage[];
}

export interface ProductImageMetadata {}

export interface ProductImage {
  imageId: number;
  metadata?: ProductImageMetadata;

  image?: Image;
}

export type ProductImagesRequest = ProductImages;

export const productImageValidator = Joi.object({
  imageId: Joi.number().required(),
  metadata: Joi.any(),
}).options({ abortEarly: false });
