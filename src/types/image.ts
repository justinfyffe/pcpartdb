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

export interface ImageRequest {
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

interface ImageEntites {
  images: Record<string, Image>;
}

export type ImageResponse = NormalizedSchema<ImageEntites, number>;
export type ImagesResponse = NormalizedSchema<ImageEntites, number[]>;

export const imageSchema = new schema.Entity('images');
