import * as db from '@prisma/client';
import { UserEntity } from '../user';

export type AccessTokenEntity = db.AccessToken & {
  user?: UserEntity;
};
