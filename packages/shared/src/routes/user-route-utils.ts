import { User } from '../user';

export function getAdminListUsersPath() {
  return '/admin/users/';
}

export function getAdminNewUserPath() {
  return '/admin/users/new/';
}

export function getAdminEditUserPath(userOrId: User | number) {
  const id = typeof userOrId === 'number' ? userOrId : userOrId.id;
  return `/admin/users/${id}/`;
}
