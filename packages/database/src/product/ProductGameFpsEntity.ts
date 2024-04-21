import * as db from '@prisma/client';
import { GameEntity } from '../game';

export type ProductGameFpsEntity = db.ProductGameFps & {
  game?: GameEntity;
};
