import * as db from '@prisma/client';
import { UserEntity } from '../user';

export type ApiKeyEntity = db.ApiKey & {
  user?: UserEntity;
};
