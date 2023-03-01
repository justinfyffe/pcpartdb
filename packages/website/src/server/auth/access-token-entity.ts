import { UserEntity } from '@pcpartdb/website/server/user/user-entity';
import * as db from '@prisma/client';

export type AccessTokenEntity = db.AccessToken & {
  user?: UserEntity;
};
