import { NormalizedSchema, schema } from 'normalizr';

export enum ProductType {
  GpuModel = 'GPU_MODEL',
}

export enum ProductMetaKey {
  Description = 'DESCRIPTION',
}

export interface ProductMeta {
  id?: number;
  productId?: number;

  source?: string;
  key: ProductMetaKey;
  value?: string;
}

interface ProductMetaEntities {
  productMeta: Record<string, ProductMeta>;
}

export type ProductMetaResponse = NormalizedSchema<
  ProductMetaEntities,
  number[]
>;

export const productMetaSchema = new schema.Entity('productMeta');
