import * as db from '@prisma/client';
import { mapToUserDto } from '@server/user/user-mappers';
import { AccessToken } from '@shared/auth';

export function mapToAccessTokenDto(
  rawToken: string,
  user: db.users,
): AccessToken {
  return {
    token: rawToken,
    user: mapToUserDto(user),
  };
}
