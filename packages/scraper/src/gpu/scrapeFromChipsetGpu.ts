import {
  GpuProduct,
  productFieldFormattedValue,
  productFieldRawValue,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { CommonScraperOptions } from '../types';
import { createGpuField } from './utils';

export interface ScrapeFromChipsetGpuOptions extends CommonScraperOptions {
  chipset: GpuProduct;
}

export async function scrapeFromChipsetGpu(
  options: ScrapeFromChipsetGpuOptions,
) {
  const { chipset, ctx } = options;

  const product: Partial<GpuProduct> = {
    parentId: chipset.id,
    fields: {
      marketSegment: createGpuField({
        field: 'marketSegment',
        raw: productFieldRawValue(chipset?.fields?.marketSegment),
        formatted: productFieldFormattedValue(chipset.fields?.marketSegment),
        ctx,
      }),
    },
  };

  return { product } as ScrapeProductResponse;
}
