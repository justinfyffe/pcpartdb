import Joi from '@hapi/joi';
import { NormalizedSchema, schema } from 'normalizr';

export interface Image {
  id: number;
  path: string;
  name: string;

  sourceName?: string;
  sourceUrl?: string;

  fileSize: number;
  height: number;
  width: number;

  uploadedAt: number;
}

export interface ImageMeta {
  fileSize: number;
  height: number;
  width: number;
}

export interface ImageFormData {
  path: string;
  name: string;

  sourceName?: string;
  sourceUrl?: string;

  fileSize?: number;
  height?: number;
  width?: number;

  file?: File;
  tempPath?: string;
}

export interface CreateImageBody {
  file: File;
  formData: string;
  tempPath?: string;
}

export interface UpdateImageBody {
  file?: File;
  formData: string;
  tempPath?: string;
}

interface ImageEntites {
  images: Record<string, Image>;
}

export type ImageResponse = NormalizedSchema<ImageEntites, number>;
export type ImagesResponse = NormalizedSchema<ImageEntites, number[]>;

export const imageSchema = new schema.Entity('images');

const imageValidator = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  fileSize: Joi.number(),
  height: Joi.number(),
  width: Joi.number(),
  sourceName: Joi.string().allow('', null),
  sourceUrl: Joi.string().allow('', null),
}).options({ abortEarly: false });

export const createImageValidator = imageValidator.concat(
  Joi.object({
    file: Joi.any().required(),
    tempPath: Joi.string().allow('', null),
  }),
);

export const updateImageValidator = imageValidator.concat(
  Joi.object({
    file: Joi.any(),
    tempPath: Joi.string().allow('', null),
  }),
);
