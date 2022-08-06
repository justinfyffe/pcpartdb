import { schema } from 'normalizr';

export enum ProductMetaKey {
  Description = 'DESCRIPTION',
}

export interface ProductMeta<T = unknown> {
  source?: string;
  key: ProductMetaKey;
  value?: T;
}

export const productMetaSchema = new schema.Entity('productMeta');
