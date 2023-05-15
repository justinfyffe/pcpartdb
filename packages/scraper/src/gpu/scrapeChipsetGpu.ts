import { Gpu } from '@pcpartdb/shared';

export interface ScrapeChipsetGpuOptions {
  chipset: Gpu;
}

export async function scrapeChipsetGpu(options: ScrapeChipsetGpuOptions) {
  const { chipset } = options;

  const gpu: Partial<Gpu> = {
    marketSegment: chipset.marketSegment,
  };

  return { gpu };
}
