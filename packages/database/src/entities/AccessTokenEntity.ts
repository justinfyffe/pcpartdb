import * as db from '@prisma/client';
import { UserEntity } from './UserEntity';

export type AccessTokenEntity = db.AccessToken & {
  user?: UserEntity;
};
