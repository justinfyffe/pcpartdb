import {
  ProductBenchmark,
  ProductField,
  ProductFieldKey,
  ProductType,
} from '@pcpartdb/shared';

export type ScrapedDataKey = ProductFieldKey | 'name';

export type ScrapedDataType =
  | number
  | string
  | string[]
  | ProductField
  | ProductBenchmark;

export interface ScrapedData {
  enabled: boolean;
  value: ScrapedDataType;
}

export interface ScrapedProduct {
  productType: ProductType;
  data: {
    name: ScrapedData;
    searchText: ScrapedData;
    otherNames: ScrapedData;
    company: ScrapedData;
    fields: Record<string, ScrapedData>;
    benchmarks: Record<string, ScrapedData>;
  };
}
