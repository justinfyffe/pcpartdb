import {
  CpuField,
  CpuFieldKey,
  CpuFieldMeta,
  hasProductFieldValue,
  ProductType,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';

interface GenerateCpuGroupKeyOptions {
  company: string;
  name: string;
}

export function generateCpuGroupKey(options: GenerateCpuGroupKeyOptions) {
  const type = ProductType.Cpu;
  const company = options.company.toUpperCase();
  let name = options.name.toUpperCase();

  if (name.endsWith(' APU')) {
    name = name.substring(0, name.length - 3).trim();
  }
  if (name.indexOf(' @ ') >= 0) {
    name = name.substring(0, name.indexOf(' @ ')).trim();
  }
  if (name.includes('CORE2')) {
    name = name.replace('CORE2', 'CORE 2').trim();
  }
  if (name.includes('DUAL-CORE MOBILE')) {
    name = name.replace('DUAL-CORE MOBILE', '');
  }
  if (name.includes('DUAL CORE MOBILE')) {
    name = name.replace('DUAL CORE MOBILE', '');
  }
  if (name.includes('DUAL-CORE')) {
    name = name.replace('DUAL-CORE', '');
  }
  if (name.includes('DUAL CORE')) {
    name = name.replace('DUAL CORE', '');
  }
  if (name.includes('QUAD-CORE')) {
    name = name.replace('QUAD-CORE', '');
  }
  if (name.includes('QUAD CORE')) {
    name = name.replace('QUAD CORE', '');
  }
  if (name.includes('SIX-CORE')) {
    name = name.replace('SIX-CORE', '');
  }
  if (name.includes('SIX CORE')) {
    name = name.replace('SIX CORE', '');
  }
  if (name.includes('EIGHT-CORE')) {
    name = name.replace('EIGHT-CORE', '');
  }
  if (name.includes('EIGHT CORE')) {
    name = name.replace('EIGHT CORE', '');
  }

  name = name
    .split(' ')
    .filter((word) => word.trim().length > 0)
    .join('_');

  return `${type}__${company}__${name}`;
}

interface CreateCpuFieldOptions<T = unknown> {
  field: CpuFieldKey;
  value: T;
  meta?: CpuFieldMeta;
  ctx?: ScraperContext;
  overwriteMemo?: boolean;
}

export function createCpuField<T = unknown>(options: CreateCpuFieldOptions<T>) {
  const { field, value, meta, ctx, overwriteMemo } = options;

  if (overwriteMemo !== true && ctx?.memoizedFields?.[field] != null) {
    // Field was previously set, use that one unless we're skipping memoization.
    return ctx.memoizedFields[field] as CpuField<T>;
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
