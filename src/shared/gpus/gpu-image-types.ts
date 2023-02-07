import Joi from '@hapi/joi';
import { Image } from '@shared/image';

export interface GpuImage {
  gpuId?: number;
  imageId?: number;

  image?: Image;
}

export type GpuImages = GpuImage[];

export const gpuImageValidator = Joi.object({
  id: Joi.number().allow(null),
}).options({ abortEarly: false });
