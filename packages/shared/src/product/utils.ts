import { parseISO } from 'date-fns';
import { formatProductName } from '../format';
import { CanMergeAutoUpdateStrategy, deepmerge } from '../utils';
import { BenchmarkKey } from './benchmarks';
import { PRODUCT_FIELD_LABELS } from './consts';
import { RankKey } from './ranks';
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

export function getProductBenchmarkLabel(benchmark: BenchmarkKey) {
  if (benchmark == null) {
    return null;
  }

  switch (benchmark) {
    // CPU Benchmarks
    case BenchmarkKey._7Zip_18_03_Multi_Thread:
      return '7-Zip 18.03 Multi-Thread';
    case BenchmarkKey._7Zip_18_03_Single_Thread:
      return '7-Zip 18.03 Single-Thread';

    case BenchmarkKey._3dMark_Cloud_Gate_Physics:
      return '3DMark Cloud Gate Physics';
    case BenchmarkKey._3dMark_06_Cpu:
      return '3DMark 06 CPU';
    case BenchmarkKey._3dMark_Fire_Strike_Standard_Physics:
      return '3DMark Fire Strike Standard Physics';
    case BenchmarkKey._3dMark_11_Performance_Physics:
      return '3DMark 11 Performance Physics';
    case BenchmarkKey._3dMark_Ice_Storm_Extreme_Physics:
      return '3DMark Ice Storm Extreme';
    case BenchmarkKey._3dMark_Ice_Storm_Physics:
      return '3DMark Ice Storm Physics';
    case BenchmarkKey._3dMark_Ice_Storm_Unlimited_Physics:
      return '3DMark Ice Storm Unlimited Physics';
    case BenchmarkKey._3dMark_Time_Spy_Cpu:
      return '3DMark Time Spy CPU';

    case BenchmarkKey.Cinebench_R11_5_Multi_Core:
      return 'Cinebench R11.5 Multi-Core';
    case BenchmarkKey.Cinebench_R11_5_Single_Core:
      return 'Cinebench R11.5 Single-Core';
    case BenchmarkKey.Cinebench_R15_Multi_Core:
      return 'Cinebench R15 Multi-Core';
    case BenchmarkKey.Cinebench_R15_Single_Core:
      return 'Cinebench R15 Single-Core';
    case BenchmarkKey.Cinebench_R20_Multi_Core:
      return 'Cinebench R20 Multi-Core';
    case BenchmarkKey.Cinebench_R20_Single_Core:
      return 'Cinebench R20 Single-Core';
    case BenchmarkKey.Cinebench_R23_Multi_Core:
      return 'Cinebench R23 Multi-Core';
    case BenchmarkKey.Cinebench_R23_Single_Core:
      return 'Cinebench R23 Single-Core';

    case BenchmarkKey.Geekbench_4_4_Multi_Core:
      return 'Geekbench 4.4 Multi-Core';
    case BenchmarkKey.Geekbench_4_4_Single_Core:
      return 'Geekbench 4.4 Single-Core';
    case BenchmarkKey.Geekbench_5_0_Multi_Core:
      return 'Geekbench 5.0 Multi-Core';
    case BenchmarkKey.Geekbench_5_0_Single_Core:
      return 'Geekbench 5.0 Single-Core';
    case BenchmarkKey.Geekbench_5_4_Multi_Core:
      return 'Geekbench 5.5 Multi-Core';
    case BenchmarkKey.Geekbench_5_4_Single_Core:
      return 'Geekbench 5.5 Single-Core';
    case BenchmarkKey.Geekbench_6_2_Multi_Core:
      return 'Geekbench 6.2 Multi-Core';
    case BenchmarkKey.Geekbench_6_2_Single_Core:
      return 'Geekbench 6.2 Single-Core';

    case BenchmarkKey.PassMark_CpuMark_Multi_Thread:
      return 'CPU Mark Multi-Thread';
    case BenchmarkKey.PassMark_CpuMark_Single_Thread:
      return 'CPU Mark Single-Thread';

    case BenchmarkKey.WinRar_4_0:
      return 'WinRAR 4.0';

    //  GPU Benchmarks
    case BenchmarkKey._3dMark_2001SE_Standard:
      return '3DMark2001 SE Score';
    case BenchmarkKey._3dMark_03_Standard:
      return '3DMark03 Score';
    case BenchmarkKey._3dMark_05_Standard:
      return '3DMark05 Score';
    case BenchmarkKey._3dMark_06_Standard:
      return '3DMark06 Score';
    case BenchmarkKey._3dMark_11_Performance_Gpu:
      return '3DMark 11 Performance GPU';
    case BenchmarkKey._3dMark_11_Performance_Score:
      return '3DMark 11 Performance Score';
    case BenchmarkKey._3dMark_Cloud_Gate_Graphics:
      return '3DMark Cloud Gate Graphics';
    case BenchmarkKey._3dMark_Cloud_Gate_Score:
      return '3DMark Cloud Gate Score';
    case BenchmarkKey._3dMark_Fire_Strike_Standard_Graphics:
      return '3DMark Fire Strike Standard Graphics';
    case BenchmarkKey._3dMark_Fire_Strike_Standard_Score:
      return '3DMark Fire Strike Standard Score';
    case BenchmarkKey._3dMark_Ice_Storm_Extreme_Graphics:
      return '3DMark Ice Storm Extreme Graphics';
    case BenchmarkKey._3dMark_Ice_Storm_Graphics:
      return '3DMark Ice Storm Graphics';
    case BenchmarkKey._3dMark_Ice_Storm_Unlimited_Graphics:
      return '3DMark Ice Storm Unlimited Graphics';
    case BenchmarkKey._3dMark_Night_Raid_Score:
      return '3DMark Night Raid Score';
    case BenchmarkKey._3dMark_Night_Raid_Graphics:
      return '3DMark Night Raid Graphics';
    case BenchmarkKey._3dMark_Timespy_Graphics:
      return '3DMark Time Spy Graphics';
    case BenchmarkKey._3dMark_Timespy_Score:
      return '3DMark Time Spy Score';
    case BenchmarkKey._3dMark_Vantage_Perf:
      return '3DMark Vantage (Performance)';
    case BenchmarkKey._3dMark_Wild_Life_Unlimited:
      return '3DMark Wild Life';
    case BenchmarkKey._3dMark_Wild_Life_Extreme_Unlimited:
      return '3DMark Wild Life Extreme';

    case BenchmarkKey.Blender_3_3_Classroom_Cuda:
      return 'Blender 3.3 Classroom CUDA';
    case BenchmarkKey.Blender_3_3_Classroom_Hip:
      return 'Blender 3.3 Classroom HIP';
    case BenchmarkKey.Blender_3_3_Classroom_Metal:
      return 'Blender 3.3 Classroom METAL';
    case BenchmarkKey.Blender_3_3_Classroom_Optix:
      return 'Blender 3.3 Classroom OptiX';

    case BenchmarkKey.Cinebench_R10_Shading_32_Bit:
      return 'Cinebench R10 Shading 32 Bit';
    case BenchmarkKey.Cinebench_R11_5_OpenGl_64_Bit:
      return 'Cinebench R11.5 OpenGL 64 Bit';
    case BenchmarkKey.Cinebench_R15_OpenGl_64_Bit:
      return 'Cinebench R15 OpenGL 64 Bit';

    case BenchmarkKey.ComputeMark_2_1_Result:
      return 'ComputeMark v2.1 Result';

    case BenchmarkKey.Geekbench_6_2_Gpu_OpenCl:
      return 'Geekbench 6.2 GPU OpenCL';
    case BenchmarkKey.Geekbench_6_2_Gpu_Vulkan:
      return 'Geekbench 6.2 GPU Vulkan';

    case BenchmarkKey.LuxMark_2_0_Room_Gpu:
      return 'LuxMark v2.0 Room GPU';
    case BenchmarkKey.LuxMark_2_0_Sala_Gpu:
      return 'LuxMark v2.0 Sala GPU';

    case BenchmarkKey.PassMark_G2dMark:
      return 'PassMark G2D Mark';
    case BenchmarkKey.PassMark_G3dMark:
      return 'PassMark G3D Mark';

    case BenchmarkKey.Specvp11_Catia_03:
      return 'specvp11 catia-03';
    case BenchmarkKey.Specvp11_Ensight_04:
      return 'specvp11 ensight-04';
    case BenchmarkKey.Specvp11_Lightwave_01:
      return 'specvp11 lightwave-01';
    case BenchmarkKey.Specvp11_Maya_03:
      return 'specvp11 maya-03';
    case BenchmarkKey.Specvp11_Proe_05:
      return 'specvp11 proe-05';
    case BenchmarkKey.Specvp11_Snx_01:
      return 'specvp11 snx-01';
    case BenchmarkKey.Specvp11_Sw_02:
      return 'specvp11 sw-02';
    case BenchmarkKey.Specvp11_Tcvis_02:
      return 'specvp11 tcvis-02';

    case BenchmarkKey.Specvp12_3dsMax_05:
      return 'specvp12 3dsmax-05';
    case BenchmarkKey.Specvp12_Catia_04:
      return 'specvp12 catia-04';
    case BenchmarkKey.Specvp12_Creo_01:
      return 'specvp12 creo-01';
    case BenchmarkKey.Specvp12_Energy_01:
      return 'specvp12 energy-01';
    case BenchmarkKey.Specvp12_Maya_04:
      return 'specvp12 maya-04';
    case BenchmarkKey.Specvp12_Medical_01:
      return 'specvp12 mediacal-01';
    case BenchmarkKey.Specvp12_Showcase_01:
      return 'specvp12 showcase-01';
    case BenchmarkKey.Specvp12_Snx_02:
      return 'specvp12 snx-02';
    case BenchmarkKey.Specvp12_Sw_03:
      return 'specvp12 sw-03';

    case BenchmarkKey.Specvp13_3dsMax_06:
      return 'specvp13 3dsmax-06';
    case BenchmarkKey.Specvp13_Catia_05:
      return 'specvp13 catia-05';
    case BenchmarkKey.Specvp13_Creo_02:
      return 'specvp13 creo-02';
    case BenchmarkKey.Specvp13_Energy_02:
      return 'specvp13 energy-02';
    case BenchmarkKey.Specvp13_Maya_05:
      return 'specvp13 maya-05';
    case BenchmarkKey.Specvp13_Medical_02:
      return 'specvp13 medical-02';
    case BenchmarkKey.Specvp13_Showcase_02:
      return 'specvp13 showcase-02';
    case BenchmarkKey.Specvp13_Snx_03:
      return 'specvp13 snx-03';
    case BenchmarkKey.Specvp13_Sw_04:
      return 'specvp13 sw-04';

    case BenchmarkKey.Specvp2020_3dsMax_07_4k:
      return 'specvp2020 3dsmax-07 4k';
    case BenchmarkKey.Specvp2020_Catia_06_4k:
      return 'specvp2020 catia-06 4k';
    case BenchmarkKey.Specvp2020_Creo_03_4k:
      return 'specvp2020 creo-03 4k';
    case BenchmarkKey.Specvp2020_Energy_03_4k:
      return 'specvp2020 energy-03 4k';
    case BenchmarkKey.Specvp2020_Maya_06_4k:
      return 'specvp2020 maya-06 4k';
    case BenchmarkKey.Specvp2020_Medical_03_4k:
      return 'specvp2020 medical-03 4k';
    case BenchmarkKey.Specvp2020_Snx_03_4k:
      return 'specvp2020 snx-04 4k';
    case BenchmarkKey.Specvp2020_Sw_05_4k:
      return 'specvp2020 solidworks-05 4k';

    case BenchmarkKey.UnigineValley_1_0_Dx:
      return 'Unigine Valley 1.0 DirectX';
    case BenchmarkKey.UnigineHeaven_2_1_High:
      return 'Unigine Heaven 2.1 - High';
    case BenchmarkKey.UnigineHeaven_3_0_Dx_11:
      return 'Unigine Heaven 3.0 DirectX 11';
    case BenchmarkKey.UnigineHeaven_3_0_OpenGl:
      return 'Unigine Heaven 3.0 OpenGL';

    default:
      throw new Error(`Invalid label for benchmark: ${benchmark}`);
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

const KEYS_TO_SKIP = [
  'root.affiliateUrl',
  'root.company',
  'root.name',
  'root.otherNames',
  'root.searchText',
  'root.slug',

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
  product: Product,
  benchmarkKey: BenchmarkKey,
) {
  return productBenchmarkValue(product, benchmarkKey) != null;
}

export function getProductBenchmark(
  product: Product,
  benchmarkKey: BenchmarkKey,
) {
  return (
    product?.benchmarks?.filter(
      (benchmark) => benchmark.benchmarkKey === benchmarkKey,
    )?.[0] || null
  );
}

export function productBenchmarkValue(
  product: Product,
  benchmarkKey: BenchmarkKey,
) {
  return getProductBenchmark(product, benchmarkKey)?.value;
}

export function setProductBenchmark(
  product: Product,
  benchmarkKey: BenchmarkKey,
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

export function hasProductRank(product: Product, rankKey: RankKey) {
  return productRankValue(product, rankKey) != null;
}

export function getProductRank(product: Product, rankKey: RankKey) {
  return (
    product?.ranks?.filter((rank) => rank.rankKey === rankKey)?.[0] || null
  );
}

export function productRankValue(product: Product, rankKey: RankKey) {
  return getProductRank(product, rankKey)?.rank;
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
