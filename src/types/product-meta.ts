import { NormalizedSchema, schema } from 'normalizr';

export enum ProductMetaKey {
  Description = 'DESCRIPTION',

  // TODO: move these to specs?
  Company = 'COMPANY',
  Generation = 'GENERATION',
  Predecessor = 'PREDECESSOR',
  Successor = 'SUCCESSOR',
  MarketSegment = 'MARKET_SEGMENT',
  MSRP = 'MSRP',
  ReleaseDate = 'RELEASE_DATE',
  Status = 'STATUS',
}

export type ProductMetaValue = number | string;

export interface ProductMeta {
  id?: number;
  productId?: number;

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
