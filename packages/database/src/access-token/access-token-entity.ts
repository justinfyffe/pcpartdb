import * as db from '@prisma/client';
import { UserEntity } from '../user/user-entity';

export type AccessTokenEntity = db.AccessToken & {
  user?: UserEntity;
};
