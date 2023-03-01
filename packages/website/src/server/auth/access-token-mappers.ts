import { UserEntity } from '@pcpartdb/website/server/user/user-entity';
import { mapToUserDto } from '@pcpartdb/website/server/user/user-mappers';
import { AccessToken } from '@pcpartdb/website/shared/auth';

export function mapToAccessTokenDto(
  rawToken: string,
  user: UserEntity,
): AccessToken {
  return {
    token: rawToken,
    user: mapToUserDto(user),
  };
}
