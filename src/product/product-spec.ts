export enum ProductSpecKey {}

export interface ProductSpec {
  id?: number;
  productId: number;

  source?: string;
  key: ProductSpecKey;
  value: string;
  overwrittenValue?: string;
}
