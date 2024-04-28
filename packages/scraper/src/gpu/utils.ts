import {
  GpuField,
  GpuFieldKey,
  GpuFieldMeta,
  hasProductFieldValue,
  ProductType,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';

interface GenerateGpuGroupKeyOptions {
  company: string;
  name: string;
}

export function generateGpuGroupKey(options: GenerateGpuGroupKeyOptions) {
  const type = ProductType.Gpu;
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
  if (name.includes(' AGP')) {
    name = name.replace(' AGP', '').trim();
  }
  if (name.includes(' IGP')) {
    name = name.replace(' IGP', '').trim();
  }
  if (name.includes(' PCIE')) {
    name = name.replace(' PCIE', '').trim();
  }
  if (name.includes(' PCI')) {
    name = name.replace(' PCI', '').trim();
  }
  if (name.includes(' MXM')) {
    name = name.replace(' MXM', '').trim();
  }
  if (name.includes(' MCM')) {
    name = name.replace(' MCM', '').trim();
  }

  name = name
    .split(' ')
    .filter((word) => word.trim().length > 0)
    .join('_');

  return `${type}__GPU_CHIPSET__${company}__${name}`;
}

interface CreateGpuFieldOptions<T = unknown> {
  field: GpuFieldKey;
  raw: T;
  formatted: string;
  meta?: GpuFieldMeta;
  ctx?: ScraperContext;
  overwriteMemo?: boolean;
}

export function createGpuField<T = unknown>(options: CreateGpuFieldOptions<T>) {
  const { field, raw, formatted, meta, ctx, overwriteMemo } = options;

  const memoized = ctx?.memoizedFields?.[field];
  if (overwriteMemo !== true && hasProductFieldValue(memoized)) {
    // Field was previously set, use that one unless we're skipping memoization.
    return ctx.memoizedFields[field] as GpuField<T>;
  }

  const productField: GpuField<T> = {
    value: raw,
    meta: {
      ...(meta ?? {}),
      fieldKey: field,
      autoUpdate: true,
      formattedValue: formatted,
    },
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
