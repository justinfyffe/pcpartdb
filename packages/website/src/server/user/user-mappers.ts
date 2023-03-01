import { User } from '@pcpartdb/website/shared/user';
import { UserEntity } from './user-entity';

export function mapToUserDto(row: UserEntity): User {
  if (row == null) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    isStaff: row.isStaff,
    registeredAt: row.registeredAt.getTime(),
  };
}

export function mapToUserEntity(
  user: Partial<User> & { passwordHash?: string },
): UserEntity {
  if (user == null) {
    return null;
  }

  return {
    id: undefined,
    email: user.email,
    passwordHash: user.passwordHash,
    isStaff: user.isStaff,
    registeredAt: undefined,
  };
}
