import { AccessToken } from '@pcpartdb/shared';
import { UserEntity } from '../user/user.entity';
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
