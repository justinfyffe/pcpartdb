import * as db from '@prisma/client';
import { UserEntity } from '@server/user/user-entity';

export type AccessTokenEntity = db.AccessToken & {
  user?: UserEntity;
};
