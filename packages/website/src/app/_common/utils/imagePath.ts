import { Image, joinUrlParts } from '@pcpartdb/shared';

export function imagePath(image: Image) {
  return joinUrlParts('/u/images', image.path);
}
