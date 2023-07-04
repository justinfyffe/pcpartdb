import { CPU_FIELD_LABELS } from './cpu';
import { GPU_FIELD_LABELS } from './gpu';
import { ProductType } from './types';

export const PRODUCT_FIELD_LABELS: Record<
  ProductType,
  Record<string, string>
> = {
  [ProductType.Cpu]: CPU_FIELD_LABELS,
  [ProductType.Gpu]: GPU_FIELD_LABELS,
};
