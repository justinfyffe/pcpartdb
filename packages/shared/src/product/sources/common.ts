// Enums

export enum ProductSourceKey {
  GeekBench = 'GEEKBENCH',
  NotebookCheck = 'NOTEBOOK_CHECK',
  PassMark = 'PASSMARK',
  PcPartPicker = 'PC_PART_PICKER',
  TechPowerUp = 'TECHPOWERUP',
  UlBenchmarks = 'UL_BENCHMARKS',
}

// Types

export interface ProductSource {
  productId?: number;
  sourceKey: ProductSourceKey;

  sourceUrl: string;

  metadata?: unknown;

  scrapedAt?: number;

  // Not in database
  sourceProductId?: number;
}
