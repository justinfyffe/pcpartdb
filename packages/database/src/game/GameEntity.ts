import * as db from '@prisma/client';
import { ImageEntity } from '../image';
import { ProductEntity } from '../product';
import { ProductGameFpsEntity } from '../product/ProductGameFpsEntity';

export type GameEntity = db.Game & {
  fps?: ProductGameFpsEntity[];
  listingImage?: ImageEntity;

  minimumCpu?: ProductEntity;
  recommendedCpu?: ProductEntity;
  minimumGpu?: ProductEntity;
  recommendedGpu?: ProductEntity;
};
