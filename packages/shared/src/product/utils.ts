import { parseISO } from 'date-fns';
import { formatProductName } from '../format';
import { CanMergeAutoUpdateStrategy, deepmerge } from '../utils';
import { BenchmarkKey } from './benchmarks';
import { PRODUCT_FIELD_LABELS } from './consts';
import { buildProductRankKey, RankType } from './ranks';
import { ProductSourceKey } from './sources';
import {
  Product,
  ProductField,
  ProductFieldKey,
  ProductionStatus,
  ProductType,
} from './types';

export function getProductFieldLabel(
  productType: ProductType,
  field: ProductFieldKey,
) {
  return PRODUCT_FIELD_LABELS?.[productType]?.[field] ?? null;
}

// These shouldn't be set on the raw value, but occasionally slip through.
const INVALID_RAW_VALUES: unknown[] = [
  'motherboard dependent',
  'portable device dependent',
  'device dependent',
  'system dependent',
  'system shared',
];

export function hasProductFieldRawValue(field: ProductField) {
  if (field == null) {
    return false;
  }

  if (field.value == null) {
    return false;
  }

  if (typeof field.value === 'string') {
    const trimmedValue = field.value.trim();
    if (INVALID_RAW_VALUES.includes(trimmedValue.toLowerCase())) {
      return false;
    } else if (trimmedValue === '') {
      return false;
    }

    return true;
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

const KEYS_TO_SKIP = [
  'root.affiliateUrl',
  'root.company',
  'root.name',
  'root.otherNames',
  'root.searchText',
  'root.slug',
  'root.summary',

  'root.benchmarks',
];
export function mergeProducts(original: Product, updated: Product): Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canMergeStrategy = (key: string, source: any, obj: any) => {
    if (KEYS_TO_SKIP.includes(key)) {
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
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return productBenchmarkValue(product, benchmarkKey) != null;
}

export function getProductBenchmark(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return (
    product?.benchmarks?.filter(
      (benchmark) => benchmark.benchmarkKey === benchmarkKey,
    )?.[0] || null
  );
}

export function productBenchmarkValue(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductBenchmark(product, benchmarkKey)?.value;
}

export function productBenchmarkValuePerMsrp(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductBenchmark(product, benchmarkKey)?.valuePerMsrp;
}

export function setProductBenchmark(
  product: Product,
  benchmarkKey: BenchmarkKey,
  value: number,
  valuePerMsrp: number,
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
      product.benchmarks[idx].valuePerMsrp = valuePerMsrp;
    }
  }
}

export function hasBenchmarkPerformanceRank(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductPerformanceRank(product, benchmarkKey) != null;
}

export function hasBenchmarkValueRank(
  product: Partial<Product>,
  benchmarkKey: BenchmarkKey,
) {
  return getProductValueRank(product, benchmarkKey) != null;
}

export function getProductRankObject(
  product: Partial<Product>,
  rankType: RankType,
  benchmark: BenchmarkKey,
) {
  const parent = product?.parent ?? product;
  const key = buildProductRankKey({ type: rankType, benchmark });
  return parent?.ranks?.[key] ?? null;
}

export function getProductPerformanceRank(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.Performance, benchmark)?.rank;
}

export function getProductPerformanceTotalRanked(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.Performance, benchmark)?.total;
}

export function getProductValueRank(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.Value, benchmark)?.rank;
}

export function getProductValueTotalRanked(
  product: Partial<Product>,
  benchmark: BenchmarkKey,
) {
  return getProductRankObject(product, RankType.Value, benchmark)?.total;
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

  return [fullName, nameWithoutCompany, nameWithoutCompanyAndBrand].filter(
    (value) => value,
  );
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

export function isPastLaunchDate(product: Product) {
  if (!hasProductFieldRawValue(product?.fields?.releaseDate)) {
    return false;
  }

  const date = new Date();
  const releaseDate = parseISO(
    productFieldRawValue(product?.fields.releaseDate),
  );
  return date.getTime() >= releaseDate.getTime();
}

export function hasLaunched(product: Product) {
  if (
    productFieldRawValue(product?.fields?.productionStatus) ===
      ProductionStatus.Unreleased ||
    !isPastLaunchDate(product)
  ) {
    return false;
  }

  return true;
}
