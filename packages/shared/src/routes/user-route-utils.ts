import { User } from '../user';
import { joinUrlParts } from '../utils';

export function getAdminListUsersPath() {
  return '/admin/users/';
}

export function getAdminNewUserPath() {
  return '/admin/users/new/';
}

export function getAdminEditUserPath(userOrId: User | number) {
  const id = typeof userOrId === 'number' ? userOrId : userOrId.id;
  return joinUrlParts('/admin/users/', String(id), '/');
}
