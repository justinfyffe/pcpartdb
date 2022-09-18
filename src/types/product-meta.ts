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

  key: ProductMetaKey;
  value: string;
  source?: string;
}

export interface ProductMetaRequest {
  key: ProductMetaKey;
  value: string;
  source?: string;
}

interface ProductMetaEntities {
  productMeta: Record<string, ProductMeta>;
}

export type ProductMetaResponse = NormalizedSchema<
  ProductMetaEntities,
  number[]
>;

export const productMetaSchema = new schema.Entity('productMeta');
