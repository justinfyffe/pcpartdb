import { Gpu, ScrapeProductResponse } from '@pcpartdb/shared';

export interface ScrapeFromChipsetGpuOptions {
  chipset: Gpu;
}

export async function scrapeFromChipsetGpu(
  options: ScrapeFromChipsetGpuOptions,
) {
  const { chipset } = options;

  const product: Partial<Gpu> = {
    chipsetId: chipset.id,
    marketSegment: chipset.marketSegment,
    productionStatus: chipset.productionStatus,
  };

  return { product } as ScrapeProductResponse;
}
