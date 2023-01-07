import Joi from '@hapi/joi';
import { Image } from '../image';

export interface PartImages {
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
  details: Joi.array().items(partImageValidator).allow(null),
}).options({ abortEarly: false });
