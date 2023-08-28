import {
  GpuField,
  GpuFieldKey,
  GpuFieldMeta,
  GpuProductType,
  hasProductFieldValue,
  ProductType,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';

interface GenerateGpuGroupKeyOptions {
  gpuType: GpuProductType;
  company: string;
  name: string;
}

export function generateGpuGroupKey(options: GenerateGpuGroupKeyOptions) {
  const type = ProductType.Gpu;
  const gpuType = options.gpuType;
  const company = options.company.toUpperCase();
  let name = options.name.toUpperCase();

  if (name.includes('LAPTOP GPU')) {
    name = name.replace('LAPTOP GPU', 'MOBILE').trim();
  }
  if (name.includes('(MOBILE)')) {
    name = name.replace('(MOBILE)', 'MOBILE').trim();
  }
  if (name.includes('WITH MAX-Q DESIGN')) {
    name = name.replace('WITH MAX-Q DESIGN', 'MAX-Q').trim();
  }
  if (name.includes(' / NFORCE')) {
    name = name.replace(' / NFORCE', ' NFORCE').trim();
  }
  if (name.includes(' + NFORCE')) {
    name = name.replace(' + NFORCE', ' NFORCE').trim();
  }
  if (name.includes('FIREPRO 3D')) {
    name = name.replace('FIREPRO 3D', 'FIREPRO').trim();
  }
  if (name.includes(' OEM')) {
    name = name.replace(' OEM', '').trim();
  }

  name = name
    .split(' ')
    .filter((word) => word.trim().length > 0)
    .join('_');

  return `${type}__${gpuType}__${company}__${name}`;
}

interface CreateGpuFieldOptions<T = unknown> {
  field: GpuFieldKey;
  value: T;
  meta?: GpuFieldMeta;
  ctx?: ScraperContext;
  overwriteMemo?: boolean;
}

export function createGpuField<T = unknown>(options: CreateGpuFieldOptions<T>) {
  const { field, value, meta, ctx, overwriteMemo } = options;

  if (overwriteMemo !== true && ctx?.memoizedFields?.[field] != null) {
    // Field was previously set, use that one unless we're skipping memoization.
    return ctx.memoizedFields[field] as GpuField<T>;
  }

  const productField = {
    value,
    meta: { ...(meta ?? {}), fieldKey: field, autoUpdate: true },
  };

  if (hasProductFieldValue(productField)) {
    // Memoize field
    if (ctx?.memoizedFields != null) {
      ctx.memoizedFields[field] = productField;
    }
  } else {
    // Reset to null if a non-value
    // Arrays cannot be null
    if (!Array.isArray(productField.value)) {
      productField.value = null;
    }
  }

  return productField;
}
