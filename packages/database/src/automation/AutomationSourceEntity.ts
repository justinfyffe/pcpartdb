import * as db from '@prisma/client';
import { ProductEntity } from '../product';

export type AutomationSourceEntity = db.AutomationSource & {
  relatedProduct?: ProductEntity;
};
