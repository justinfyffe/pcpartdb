import { UserEntity } from '@pcpartdb/database';
import { AccessToken } from '@pcpartdb/shared/auth';
import { mapToUserDto } from '../user/user.mapper';

export function mapToAccessTokenDto(
  rawToken: string,
  user: UserEntity,
): AccessToken {
  return {
    token: rawToken,
    user: mapToUserDto(user),
  };
}
