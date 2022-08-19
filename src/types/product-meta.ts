import { NormalizedSchema, schema } from 'normalizr';

export enum ProductMetaKey {
  Description = 'DESCRIPTION',
}

export type ProductMetaValue = number | string | object;

export interface ProductMeta {
  source?: string;
  key: ProductMetaKey;
  value?: ProductMetaValue;
}

interface ProductMetaEntities {
  productMeta: Record<string, ProductMeta>;
}

export type ProductMetaResponse = NormalizedSchema<
  ProductMetaEntities,
  number[]
>;

export const productMetaSchema = new schema.Entity('productMeta');
