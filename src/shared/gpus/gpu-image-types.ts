import Joi from '@hapi/joi';

export interface GpuImage {
  id: number;
}

export type GpuImages = GpuImage[];

export const gpuImageValidator = Joi.object({
  id: Joi.number().allow(null),
}).options({ abortEarly: false });
