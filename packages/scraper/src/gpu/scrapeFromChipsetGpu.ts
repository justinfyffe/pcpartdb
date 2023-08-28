import {
  Gpu,
  productFieldValue,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { CommonScraperOptions } from '../types';
import { createGpuField } from './utils';

export interface ScrapeFromChipsetGpuOptions extends CommonScraperOptions {
  chipset: Gpu;
}

export async function scrapeFromChipsetGpu(
  options: ScrapeFromChipsetGpuOptions,
) {
  const { chipset, ctx } = options;

  const product: Partial<Gpu> = {
    chipsetId: chipset.id,
    marketSegment: createGpuField({
      field: 'marketSegment',
      value: productFieldValue(chipset?.marketSegment),
      ctx,
    }),
  };

  return { product } as ScrapeProductResponse;
}
