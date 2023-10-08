import { formatProductName } from '../format';
import { CanMergeAutoUpdateStrategy, deepmerge } from '../utils';
import { BenchmarKey } from './benchmarks';
import { PRODUCT_FIELD_LABELS } from './consts';
import { ProductSourceKey } from './sources';
import { Product, ProductField, ProductFieldKey, ProductType } from './types';

export function getProductFieldLabel(
  productType: ProductType,
  field: ProductFieldKey,
) {
  return PRODUCT_FIELD_LABELS?.[productType]?.[field] ?? null;
}

export function getProductBenchmarkLabel(benchmark: BenchmarKey) {
  switch (benchmark) {
    case BenchmarKey.CpuMarkMultiThread:
      return 'CPU Mark (Multi-thread)';
    case BenchmarKey.CpuMarkSingleThread:
      return 'CPU Mark (Single-thread)';
    case BenchmarKey.GeekBenchMultiCore:
      return 'GeekBench (Multi-core)';
    case BenchmarKey.GeekBenchSingleCore:
      return 'GeekBench (Single-core)';
    case BenchmarKey.G2dMark:
      return 'G2D Mark';
    case BenchmarKey.G3dMark:
      return 'G3D Mark';
    case BenchmarKey.TimespyGraphics:
      return 'Time Spy Graphics';
  }
}

export function hasProductFieldRawValue(field: ProductField) {
  if (field == null) {
    return false;
  }

  if (field.value == null) {
    return false;
  }

  if (typeof field.value === 'string') {
    return field.value.trim() !== '';
  }

  if (typeof field.value === 'number') {
    return field.value !== 0;
  }

  if (Array.isArray(field.value)) {
    return (
      field.value.filter((value) => value != null && value !== '').length > 0
    );
  }

  return true;
}

export function hasProductFieldFormattedValue(field: ProductField) {
  if (field == null) {
    return false;
  }

  if (field.meta?.formattedValue == null) {
    return false;
  }

  if (field.meta?.formattedValue === '') {
    return false;
  }

  return true;
}

export function hasProductFieldValue(field: ProductField) {
  return hasProductFieldRawValue(field) || hasProductFieldFormattedValue(field);
}

export function productFieldRawValue<T = unknown>(field: ProductField<T>) {
  if (!hasProductFieldRawValue(field)) {
    return null;
  }

  return field.value as T;
}

export function productFieldFormattedValue(field: ProductField) {
  if (!hasProductFieldFormattedValue(field)) {
    return null;
  }

  return field.meta?.formattedValue ?? null;
}

export function isProductField(value: unknown): value is ProductField {
  return (
    value != null &&
    typeof value === 'object' &&
    'value' in value &&
    'meta' in value
  );
}

export function compareProductFields(
  field1: ProductField,
  field2: ProductField,
) {
  if (hasProductFieldRawValue(field1) && !hasProductFieldRawValue(field2)) {
    return -1;
  } else if (
    !hasProductFieldRawValue(field1) &&
    hasProductFieldRawValue(field2)
  ) {
    return 1;
  } else if (
    !hasProductFieldRawValue(field1) &&
    !hasProductFieldRawValue(field2)
  ) {
    return 0;
  }

  if (field1.meta?.fieldKey !== field2.meta?.fieldKey) {
    throw new Error('Cannot compare two different types of fields');
  }

  if (typeof field1.value === 'number' && typeof field2.value === 'number') {
    return field1.value - field2.value;
  } else if (
    typeof field1.value === 'string' &&
    typeof field2.value === 'string'
  ) {
    return field1.value.localeCompare(field2.value);
  } else if (
    typeof field1.value === 'boolean' &&
    typeof field2.value === 'boolean'
  ) {
    if (field1.value && !field2.value) {
      return 1;
    } else if (!field1.value && field2.value) {
      return -1;
    } else {
      return 0;
    }
  } else if (
    Array.isArray(field1.value || []) &&
    Array.isArray(field2.value || [])
  ) {
    const arr1 = (field1.value as unknown[]) || [];
    const arr2 = (field2.value as unknown[]) || [];
    return arr1.join(',').localeCompare(arr2.join(','));
  } else {
    throw new Error(
      `Cannot compare fields. Invalid type ${typeof field1.value} (${
        field1.value
      }) and ${typeof field2.value} (${field2.value})`,
    );
  }
}

export function canAutoUpdateProductField(field: ProductField) {
  return field?.meta?.autoUpdate ?? true;
}

export function mergeProducts(original: Product, updated: Product): Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canMergeStrategy = (key: string, source: any, obj: any) => {
    if (key === 'root.benchmarks') {
      // Product Benchmarks are merged elsewhere
      return false;
    }

    return CanMergeAutoUpdateStrategy(key, source, obj);
  };

  return deepmerge({ canMergeStrategy }, original, updated);
}

export function getAffiliateUrl(product: Product) {
  const associateKey = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATES_KEY;
  if (product.affiliateUrl) {
    const url = new URL(product.affiliateUrl);
    if (!url.searchParams.has('tag')) {
      url.searchParams.append('tag', associateKey);
    }
    return url.toString();
  }

  const productName = formatProductName(product);
  const query = productName.replaceAll(' ', '+');

  // Return generated affiliate url based on search results
  return `https://www.amazon.com/s?k=${query}&tag=${associateKey}`;
}

export function hasProductBenchmark(
  product: Product,
  benchmarkKey: BenchmarKey,
) {
  return productBenchmarkValue(product, benchmarkKey) != null;
}

export function getProductBenchmark(
  product: Product,
  benchmarkKey: BenchmarKey,
) {
  return (
    product?.benchmarks?.filter(
      (benchmark) => benchmark.benchmarkKey === benchmarkKey,
    )?.[0] || null
  );
}

export function productBenchmarkValue(
  product: Product,
  benchmarkKey: BenchmarKey,
) {
  return getProductBenchmark(product, benchmarkKey)?.value;
}

export function setProductBenchmark(
  product: Product,
  benchmarkKey: BenchmarKey,
  value: number,
) {
  const hasBenchmark = hasProductBenchmark(product, benchmarkKey);
  if (!hasBenchmark && value != null) {
    // Add benchmark
    product.benchmarks.push({ benchmarkKey, value });
  }

  if (hasBenchmark) {
    const idx = product.benchmarks.findIndex(
      (benchmark) => benchmark.benchmarkKey === benchmarkKey,
    );

    if (value == null) {
      // Delete benchmark
      product.benchmarks.splice(idx, 1);
    } else {
      // Overwrite benchmark
      product.benchmarks[idx].value = value;
    }
  }
}

export function hasProductSource(
  product: Product,
  sourceKey: ProductSourceKey,
) {
  return productSourceUrl(product, sourceKey) != null;
}

export function getProductSource(
  product: Product,
  sourceKey: ProductSourceKey,
) {
  return (
    product?.sources?.filter((source) => source.sourceKey === sourceKey)?.[0] ||
    null
  );
}

export function productSourceUrl(
  product: Product,
  sourceKey: ProductSourceKey,
) {
  return getProductSource(product, sourceKey)?.sourceUrl;
}

export interface GenerateProductSearchableTextOptions {
  company?: string;
  name?: string;
}

export function generateProductSearchableText(
  options: GenerateProductSearchableTextOptions,
) {
  const { company, name } = options;

  return `${company || ''} ${name || ''}`.trim();
}

export interface GenerateProductOtherNamesOptions {
  company?: string;
  name?: string;
}

export function generateProductOtherNames(
  options: GenerateProductOtherNamesOptions,
) {
  const { company, name } = options;
  const fullName = formatProductName({ company, name });
  const nameWithoutCompany = formatProductName(
    { company, name },
    { company: false },
  );
  const nameWithoutCompanyAndBrand = formatProductName(
    { company, name },
    { company: false, brand: false },
  );

  return [fullName, nameWithoutCompany, nameWithoutCompanyAndBrand];
}

export interface GenerateProductSlugOptions {
  company?: string;
  name?: string;
}

export function generateProductSlug(options: GenerateProductSlugOptions) {
  const { company, name } = options;

  const slugParts = [];
  if (company != null) {
    const companyParts = company
      .replaceAll('+', ' plus ')
      .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
      .split(' ')
      .map((value) => value.toLowerCase().trim())
      .filter((value) => value.length > 0);
    slugParts.push(...companyParts);
  }
  if (name != null) {
    const nameParts = name
      .replaceAll('+', ' plus ')
      .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
      .split(' ')
      .map((value) => value.toLowerCase().trim())
      .filter((value) => value.length > 0);
    slugParts.push(...nameParts);
  }

  return slugParts.join('-');
}
