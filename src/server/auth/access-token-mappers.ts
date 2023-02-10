import { UserEntity } from '@server/user/user-entity';
import { mapToUserDto } from '@server/user/user-mappers';
import { AccessToken } from '@shared/auth';

export function mapToAccessTokenDto(
  rawToken: string,
  user: UserEntity,
): AccessToken {
  return {
    token: rawToken,
    user: mapToUserDto(user),
  };
}
