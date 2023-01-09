import Joi from '@hapi/joi';
import { Image } from '../image';

export interface PartImageMetadata {}

export interface PartImage {
  id: number;
  metadata?: PartImageMetadata;

  image?: Image;
}

export type PartImagesRequest = PartImage[];

export const partImageValidator = Joi.object({
  id: Joi.number().required(),
  metadata: Joi.any(),
}).options({ abortEarly: false });

export const partImagesValidator = Joi.array()
  .items(partImageValidator.allow(null))
  .options({ abortEarly: false });
