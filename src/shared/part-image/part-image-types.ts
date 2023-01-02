import Joi from '@hapi/joi';
import { Image } from '../image';

export interface PartImages {
  thumbnail?: PartImage;
  autocomplete?: PartImage;
  details?: PartImage[];
}

export interface PartImageMetadata {}

export interface PartImage {
  imageId: number;
  metadata?: PartImageMetadata;

  image?: Image;
}

export type PartImagesRequest = PartImages;

export const partImageValidator = Joi.object({
  imageId: Joi.number().required(),
  metadata: Joi.any(),
}).options({ abortEarly: false });

export const partImagesValidator = Joi.object({
  thumbnail: partImageValidator.allow(null),
  autocomplete: partImageValidator.allow(null),
  details: Joi.array().items(partImageValidator).allow(null),
}).options({ abortEarly: false });
