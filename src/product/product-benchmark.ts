export enum ProductBenchmarkKey {}

export interface ProductBenchmark {
  id?: number;
  productId: number;

  source?: string;
  key: ProductBenchmarkKey;
  value: string;
  overwrittenValue?: string;
}
