import { Image } from '../image';

export interface PartImageMetadata {}

export interface PartImage {
  id: number;
  metadata?: PartImageMetadata;

  image?: Image;
}
