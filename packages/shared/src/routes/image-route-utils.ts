import { Image } from '../image';

export function getAdminListImagesPath() {
  return '/admin/images/';
}

export function getAdminNewImagePath() {
  return '/admin/images/new/';
}

export function getAdminEditImagePath(imageOrId: Image | number) {
  const id = typeof imageOrId === 'number' ? imageOrId : imageOrId.id;
  return `/admin/images/${id}/`;
}
