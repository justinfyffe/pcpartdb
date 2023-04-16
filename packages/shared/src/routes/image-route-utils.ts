import { Image } from '../image';
import { joinUrlParts } from '../utils';

export function getAdminListImagesPath() {
  return '/admin/images/';
}

export function getAdminNewImagePath() {
  return '/admin/images/new/';
}

export function getAdminEditImagePath(imageOrId: Image | number) {
  const id = typeof imageOrId === 'number' ? imageOrId : imageOrId.id;
  return joinUrlParts('/admin/images/', String(id), '/');
}
