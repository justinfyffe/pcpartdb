import * as db from '@prisma/client';
import { ImageEntity } from '../image';

export type ProductImageEntity = db.ProductImage & {
  image?: ImageEntity;
};
