import * as db from '@prisma/client';
import { User } from '@shared/user';

export function mapToUserDto(row: db.users): User {
  if (row == null) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    isStaff: row.is_staff,
    registeredAt: row.registered_at.getTime(),
  };
}
