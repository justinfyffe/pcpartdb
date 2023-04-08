import { AccessToken } from '@pcpartdb/shared';
import { UserEntity } from '../entities';
import { mapToUserDto } from './userMapper';

export function mapToAccessTokenDto(
  rawToken: string,
  user: UserEntity,
): AccessToken {
  return {
    token: rawToken,
    user: mapToUserDto(user),
  };
}
