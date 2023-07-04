import { ProductField, ProductFieldKey, ProductType } from '@pcpartdb/shared';

export type ScrapedDataKey = ProductFieldKey | 'name';

export type ScrapedDataType = number | string | ProductField;

export interface ScrapedData {
  enabled: boolean;
  value: ScrapedDataType;
}

export interface ScrapedProduct {
  productType: ProductType;
  scrapedData: Record<string, ScrapedData>;
}
