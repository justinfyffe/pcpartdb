import { Image, ListImagesQuery } from '../image';
import { joinUrlParts } from '../utils';

export function getAdminListImagesPath(query?: ListImagesQuery) {
  const path = '/admin/images/';

  const searchParams =
    query != null
      ? Object.fromEntries(generateSearchParamsFromImagesQuery(query))
      : {};

  const combinedParams = new URLSearchParams({
    ...searchParams,
  }).toString();

  return joinUrlParts(path, combinedParams ? `?${combinedParams}` : '');
}

function generateSearchParamsFromImagesQuery(query: ListImagesQuery) {
  const params = new URLSearchParams();

  if (query.filter?.search) {
    params.append('search', query.filter.search);
  }

  return params;
}

export function getAdminNewImagePath() {
  return '/admin/images/new/';
}

export function getAdminEditImagePath(imageOrId: Image | number) {
  const id = typeof imageOrId === 'number' ? imageOrId : imageOrId.id;
  return joinUrlParts('/admin/images/', String(id), '/');
}
