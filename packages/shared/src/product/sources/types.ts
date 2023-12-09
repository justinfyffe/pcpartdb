import { Product } from '../types';

export enum ProductSourceKey {
  GeekBench = 'GEEKBENCH',
  NotebookCheck = 'NOTEBOOK_CHECK',
  PassMark = 'PASSMARK',
  TechPowerUp = 'TECHPOWERUP',
  UlBenchmarks = 'UL_BENCHMARKS',
}

export interface ProductSource {
  productId?: number;
  sourceKey: ProductSourceKey;

  sourceUrl: string;

  metadata?: any;

  scrapedAt?: number;

  // Not in database
  sourceProductId?: number;
  sourceProduct?: Product;
}
