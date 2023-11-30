import {
  CpuAdditionalData,
  CpuProduct,
  formatGpuDimensions,
  GpuAdditionalData,
  GpuProduct,
  isCpuProduct,
  isGpuProduct,
  Product,
  ProductAdditionalData,
  productFieldFormattedValue,
} from '@pcpartdb/shared';

interface SummaryVariable<TProduct, TAdditionalData> {
  variable: string;
  replacer: (product: TProduct, additionalData: TAdditionalData) => string;
}
const COMMON_SUMMARY_VARIABLES: SummaryVariable<
  Product,
  ProductAdditionalData
>[] = [
  {
    variable: 'architecture',
    // Example: "Ada Lovelace"
    replacer: (p) =>
      productFieldFormattedValue(p.fields?.architecture)?.toLowerCase() ?? '',
  },
  {
    variable: 'codename',
    // Example: "AD104"
    replacer: (p) =>
      productFieldFormattedValue(p.fields?.codename)?.toLowerCase() ?? '',
  },
  {
    variable: 'company',
    // Example: "NVIDIA"
    replacer: (p) => p.company ?? '',
  },
  {
    variable: 'marketSegment',
    // Example: "desktop"
    replacer: (p) =>
      productFieldFormattedValue(p.fields?.marketSegment)?.toLowerCase() ?? '',
  },
  {
    variable: 'msrp',
    // Example: "$599"
    replacer: (p) => productFieldFormattedValue(p.fields?.msrp) ?? '',
  },
  {
    variable: 'performanceRating',
    // Example: 100.00
    replacer: (p) =>
      productFieldFormattedValue(p.fields?.performanceRating) ?? '',
  },
  {
    variable: 'processSize',
    // Example: "5 nm"
    replacer: (p) => productFieldFormattedValue(p.fields?.processSize) ?? '',
  },
  {
    variable: 'releaseDate',
    // Example: "Q2 2023"
    replacer: (p) => productFieldFormattedValue(p.fields?.releaseDate) ?? '',
  },
  {
    variable: 'tdp',
    // Example: "50 W"
    replacer: (p) => productFieldFormattedValue(p.fields?.tdp) ?? '',
  },
  {
    variable: 'valueRating',
    // Example: 100.00
    replacer: (p) =>
      productFieldFormattedValue(p.fields?.performancePerMsrp) ?? '',
  },
];

const CPU_SUMMARY_VARIABLES: SummaryVariable<CpuProduct, CpuAdditionalData>[] =
  [];

const GPU_SUMMARY_VARIABLES: SummaryVariable<GpuProduct, GpuAdditionalData>[] =
  [
    {
      variable: 'dimensions',
      // Example: "300 mm (L) x 300 mm (H)"
      replacer: (p) => formatGpuDimensions(p) ?? '',
    },
    {
      variable: 'memoryBandwidth',
      // Example: "24 GB/s"
      replacer: (p) =>
        productFieldFormattedValue(p.fields?.memoryBandwidth) ?? '',
    },
    {
      variable: 'memoryClock',
      // Example: "24 MHz"
      replacer: (p) => productFieldFormattedValue(p.fields?.memoryClock) ?? '',
    },
    {
      variable: 'memoryInterface',
      // Example: "24 bit"
      replacer: (p) =>
        productFieldFormattedValue(p.fields?.memoryInterface) ?? '',
    },
    {
      variable: 'memorySize',
      // Example: "24 GB"
      replacer: (p) => productFieldFormattedValue(p.fields?.memorySize) ?? '',
    },
    {
      variable: 'memoryType',
      // Example: "GDDR6X"
      replacer: (p) => productFieldFormattedValue(p.fields?.memoryType) ?? '',
    },
    {
      variable: 'slotWidth',
      // Example: "50 W"
      replacer: (p) => productFieldFormattedValue(p.fields?.slotWidth) ?? '',
    },
    {
      variable: 'suggestedPsu',
      // Example: "50 W"
      replacer: (p) => productFieldFormattedValue(p.fields?.suggestedPsu) ?? '',
    },
  ];

export function populateSummaryVariables(
  rawOverview: string,
  product: Product,
  additionalData: ProductAdditionalData,
) {
  let overview = rawOverview;
  for (const overviewVariable of COMMON_SUMMARY_VARIABLES) {
    overview = overview.replaceAll(
      `{{${overviewVariable.variable}}}`,
      overviewVariable.replacer(product, additionalData),
    );
  }

  if (isCpuProduct(product)) {
    for (const cpuVaraible of CPU_SUMMARY_VARIABLES) {
      overview = overview.replaceAll(
        `{{${cpuVaraible.variable}}}`,
        cpuVaraible.replacer(product, additionalData as CpuAdditionalData),
      );
    }
  }

  if (isGpuProduct(product)) {
    for (const gpuVaraible of GPU_SUMMARY_VARIABLES) {
      overview = overview.replaceAll(
        `{{${gpuVaraible.variable}}}`,
        gpuVaraible.replacer(product, additionalData as GpuAdditionalData),
      );
    }
  }

  return overview;
}
