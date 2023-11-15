import * as db from '@prisma/client';
import { ProductEntity } from './ProductEntity';

export type RelatedProductEntity = db.RelatedProduct & {
  product?: ProductEntity;
  relatedProduct?: ProductEntity;
};
