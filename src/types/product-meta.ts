import { schema } from 'normalizr';

export enum ProductMetaKey {
  Description = 'DESCRIPTION',
}

export interface ProductMeta<T = unknown> {
  id?: number;
  productId: number;

  source?: string;
  key: ProductMetaKey;
  value?: T;
}

export const productMetaSchema = new schema.Entity('productMeta');
