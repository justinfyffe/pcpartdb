import { Image, joinUrlParts } from '@pcpartdb/shared';

export function imagePath(image: Partial<Image>) {
  return joinUrlParts('/u/images', image.path);
}
