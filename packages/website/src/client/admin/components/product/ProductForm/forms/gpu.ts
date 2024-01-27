import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  BandwidthUnit,
  BitUnit,
  CreateProductRequest,
  CurrencyUnit,
  FlopsUnit,
  formatMarketSegment,
  formatProductionStatus,
  FrequencyUnit,
  GpuField,
  GpuFields,
  isGpuProduct,
  LengthUnit,
  MarketSegment,
  MemorySizeUnit,
  NumericUnit,
  PixelFillRateUnit,
  Product,
  ProductBenchmark,
  productBenchmarkSchema,
  productFieldFormattedValue,
  productFieldSchema,
  ProductImage,
  productImageSchema,
  ProductionStatus,
  ProductSource,
  productSourceSchema,
  ProductType,
  TextureFillRateUnit,
  UpdateProductRequest,
  WattageUnit,
  WeightUnit,
} from '@pcpartdb/shared';
import {
  ProductFormInputGroups,
  ProductFormInputType,
} from 'packages/website/src/client/admin/components/product/ProductForm/types';
import { SelectValue } from 'packages/website/src/client/shared/components/Select/Select';
import { UseFormProps } from 'react-hook-form';

//
// Form Data Structure
//

export interface GpuFormData {
  // GPU Parent / Chipset ID
  parentId?: number;

  name: string;
  slug: string;

  company?: string;
  otherNames?: string[];
  searchText?: string;
  affiliateUrl?: string;
  summary?: string;

  // General
  partNumber?: GpuField<string>;
  marketSegment?: GpuField<MarketSegment>;
  msrp?: GpuField<number>;
  releaseDate?: GpuField<string>;
  productionStatus?: GpuField<ProductionStatus>;

  // Processor
  codename?: GpuField<string>;
  architecture?: GpuField<string>;
  processSize?: GpuField<number>;
  transistors?: GpuField<number>;

  // Board Compatibility & Dimensions
  slotWidth?: GpuField<number>;
  length?: GpuField<number>;
  width?: GpuField<number>;
  height?: GpuField<number>;
  weight?: GpuField<number>;
  busInterface?: GpuField<string>;
  tdp?: GpuField<number>;
  suggestedPsu?: GpuField<number>;
  powerConnectors?: GpuField<string>;
  outputs?: GpuField<string>;

  // Cores & Clock Speeds
  gpuCores?: GpuField<number>;
  computeUnits?: GpuField<number>;
  tmus?: GpuField<number>;
  rops?: GpuField<number>;
  tensorCores?: GpuField<number>;
  rtCores?: GpuField<number>;
  gpuCoreBaseClock?: GpuField<number>;
  gpuCoreBoostClock?: GpuField<number>;
  l1Cache?: GpuField<number>;
  l2Cache?: GpuField<number>;

  // Theoretical Performance
  pixelRate?: GpuField<number>;
  textureRate?: GpuField<number>;
  fp32?: GpuField<number>;
  fp64?: GpuField<number>;

  // Memory
  memorySize?: GpuField<number>;
  memoryType?: GpuField<string>;
  memoryClock?: GpuField<number>;
  memoryInterface?: GpuField<number>;
  memoryBandwidth?: GpuField<number>;

  // API Support
  directxVersion?: GpuField<string>;
  openClVersion?: GpuField<string>;
  openGlVersion?: GpuField<string>;
  shaderModelVersion?: GpuField<string>;

  // Benchmarks
  benchmarks?: ProductBenchmark[];

  // Sources
  sources?: ProductSource[];

  // Images
  images?: ProductImage[];
}

//
// Form Options
//

const gpuFormSchema = Joi.object({
  parentId: Joi.number().allow(null),

  name: Joi.string().required(),
  slug: Joi.string().required(),
  company: Joi.string(),
  otherNames: Joi.array().items(Joi.string()).allow(null),
  searchText: Joi.string().allow(null),
  affiliateUrl: Joi.string().allow(null),
  summary: Joi.string().allow(null),

  // Sources
  sources: Joi.array().items(productSourceSchema),

  // General
  partNumber: productFieldSchema.allow(null),
  marketSegment: productFieldSchema.allow(null),
  msrp: productFieldSchema.allow(null),
  releaseDate: productFieldSchema.allow(null),
  productionStatus: productFieldSchema.allow(null),

  // Processor
  codename: productFieldSchema.allow(null),
  architecture: productFieldSchema.allow(null),
  processSize: productFieldSchema.allow(null),
  transistors: productFieldSchema.allow(null),

  // Board Compatibility & Dimensions
  slotWidth: productFieldSchema.allow(null),
  length: productFieldSchema.allow(null),
  width: productFieldSchema.allow(null),
  height: productFieldSchema.allow(null),
  weight: productFieldSchema.allow(null),
  busInterface: productFieldSchema.allow(null),
  tdp: productFieldSchema.allow(null),
  suggestedPsu: productFieldSchema.allow(null),
  powerConnectors: productFieldSchema.allow(null),
  outputs: productFieldSchema.allow(null),

  // Cores & Clock Speed
  gpuCores: productFieldSchema.allow(null),
  computeUnits: productFieldSchema.allow(null),
  tmus: productFieldSchema.allow(null),
  rops: productFieldSchema.allow(null),
  tensorCores: productFieldSchema.allow(null),
  rtCores: productFieldSchema.allow(null),
  gpuCoreBaseClock: productFieldSchema.allow(null),
  gpuCoreBoostClock: productFieldSchema.allow(null),
  l1Cache: productFieldSchema.allow(null),
  l2Cache: productFieldSchema.allow(null),

  // Theoretical Performance
  pixelRate: productFieldSchema.allow(null),
  textureRate: productFieldSchema.allow(null),
  fp32: productFieldSchema.allow(null),
  fp64: productFieldSchema.allow(null),

  // Memory
  memorySize: productFieldSchema.allow(null),
  memoryType: productFieldSchema.allow(null),
  memoryClock: productFieldSchema.allow(null),
  memoryInterface: productFieldSchema.allow(null),
  memoryBandwidth: productFieldSchema.allow(null),

  // API Support
  directxVersion: productFieldSchema.allow(null),
  openClVersion: productFieldSchema.allow(null),
  openGlVersion: productFieldSchema.allow(null),
  shaderModelVersion: productFieldSchema.allow(null),

  // Benchmarks
  benchmarks: Joi.array().items(productBenchmarkSchema),

  // Images
  images: Joi.array().items(productImageSchema),
}).options({ abortEarly: false });

export function gpuFormOptions(product?: Product): UseFormProps<GpuFormData> {
  if (product != null && !isGpuProduct(product)) {
    throw new Error(
      `Invalid product type for gpuFormOptions: ${product?.productType}`,
    );
  }

  const benchmarks = product?.benchmarks || [];
  const sources = product?.sources || [];
  const images = product?.images || [];

  return {
    resolver: joiResolver(gpuFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: product?.name ?? null,
      slug: product?.slug ?? null,
      otherNames: product?.otherNames || [],
      searchText: product?.searchText ?? null,
      affiliateUrl: product?.affiliateUrl ?? null,
      summary: product?.summary ?? null,

      parentId: product?.parentId ?? null,

      // Data Sources
      sources,

      // General
      partNumber: product?.fields?.partNumber ?? null,
      company: product?.company ?? null,
      marketSegment: product?.fields?.marketSegment ?? null,
      msrp: product?.fields?.msrp ?? null,
      releaseDate: product?.fields?.releaseDate ?? null,
      productionStatus: product?.fields?.productionStatus ?? null,

      // Processor
      codename: product?.fields?.codename ?? null,
      architecture: product?.fields?.architecture ?? null,
      processSize: product?.fields?.processSize ?? null,
      transistors: product?.fields?.transistors ?? null,

      // Board Compatibility & Dimensions
      slotWidth: product?.fields?.slotWidth ?? null,
      length: product?.fields?.length ?? null,
      width: product?.fields?.width ?? null,
      height: product?.fields?.height ?? null,
      weight: product?.fields?.weight ?? null,
      busInterface: product?.fields?.busInterface ?? null,
      tdp: product?.fields?.tdp ?? null,
      suggestedPsu: product?.fields?.suggestedPsu ?? null,
      powerConnectors: product?.fields?.powerConnectors ?? null,
      outputs: product?.fields?.outputs ?? null,

      // Cores & Clock Speeds
      gpuCores: product?.fields?.gpuCores ?? null,
      computeUnits: product?.fields?.computeUnits ?? null,
      tmus: product?.fields?.tmus ?? null,
      rops: product?.fields?.rops ?? null,
      tensorCores: product?.fields?.tensorCores ?? null,
      rtCores: product?.fields?.rtCores ?? null,
      gpuCoreBaseClock: product?.fields?.gpuCoreBaseClock ?? null,
      gpuCoreBoostClock: product?.fields?.gpuCoreBoostClock ?? null,
      l1Cache: product?.fields?.l1Cache ?? null,
      l2Cache: product?.fields?.l2Cache ?? null,

      // Theoretical Performance
      pixelRate: product?.fields?.pixelRate ?? null,
      textureRate: product?.fields?.textureRate ?? null,
      fp32: product?.fields?.fp32 ?? null,
      fp64: product?.fields?.fp64 ?? null,

      // Memory
      memorySize: product?.fields?.memorySize ?? null,
      memoryType: product?.fields?.memoryType ?? null,
      memoryClock: product?.fields?.memoryClock ?? null,
      memoryInterface: product?.fields?.memoryInterface ?? null,
      memoryBandwidth: product?.fields?.memoryBandwidth ?? null,

      // API Support
      directxVersion: product?.fields?.directxVersion ?? null,
      openClVersion: product?.fields?.openClVersion ?? null,
      openGlVersion: product?.fields?.openGlVersion ?? null,
      shaderModelVersion: product?.fields?.shaderModelVersion ?? null,

      // Benchmarks
      benchmarks,

      // Images
      images,
    },
  };
}

//
// Form Data Structure to Request Conversion
//

export function formDataToGpuRequest(
  formData: GpuFormData,
): CreateProductRequest | UpdateProductRequest {
  return {
    product: {
      productType: ProductType.Gpu,
      parentId: formData.parentId,
      slug: formData.slug,
      name: formData.name,
      company: formData.company,
      otherNames: formData.otherNames,
      searchText: formData.searchText,
      affiliateUrl: formData.affiliateUrl,
      summary: formData.summary,

      // Product Fields
      fields: {
        // General Info
        partNumber: formData.partNumber,
        marketSegment: formData.marketSegment,
        msrp: formData.msrp,
        releaseDate: formData.releaseDate,
        productionStatus: formData.productionStatus,

        // Processor
        codename: formData.codename ?? null,
        architecture: formData.architecture ?? null,
        processSize: formData.processSize ?? null,
        transistors: formData.transistors ?? null,

        // Board Compatibility & Dimensions
        slotWidth: formData.slotWidth ?? null,
        length: formData.length ?? null,
        width: formData.width ?? null,
        height: formData.height ?? null,
        weight: formData.weight ?? null,
        busInterface: formData.busInterface ?? null,
        tdp: formData.tdp ?? null,
        suggestedPsu: formData.suggestedPsu ?? null,
        powerConnectors: formData.powerConnectors ?? null,
        outputs: formData.outputs ?? null,

        // Cores & Clock Speeds
        gpuCores: formData.gpuCores ?? null,
        computeUnits: formData.computeUnits ?? null,
        tmus: formData.tmus ?? null,
        rops: formData.rops ?? null,
        tensorCores: formData.tensorCores ?? null,
        rtCores: formData.rtCores ?? null,
        gpuCoreBaseClock: formData.gpuCoreBaseClock ?? null,
        gpuCoreBoostClock: formData.gpuCoreBoostClock ?? null,
        l1Cache: formData.l1Cache ?? null,
        l2Cache: formData.l2Cache ?? null,

        // Theoretical Performance
        pixelRate: formData.pixelRate ?? null,
        textureRate: formData.textureRate ?? null,
        fp32: formData.fp32 ?? null,
        fp64: formData.fp64 ?? null,

        // Memory
        memorySize: formData.memorySize ?? null,
        memoryType: formData.memoryType ?? null,
        memoryClock: formData.memoryClock ?? null,
        memoryInterface: formData.memoryInterface ?? null,
        memoryBandwidth: formData.memoryBandwidth ?? null,

        // API Support
        directxVersion: formData.directxVersion ?? null,
        openClVersion: formData.openClVersion ?? null,
        openGlVersion: formData.openGlVersion ?? null,
        shaderModelVersion: formData.shaderModelVersion ?? null,
      } as GpuFields,

      // Meta
      metadata: {},

      benchmarks: formData.benchmarks?.filter(
        (benchmark) => benchmark != null && benchmark.value != null,
      ),

      images:
        formData.images
          ?.filter((image) => image != null)
          .map((image) => ({ imageId: image.imageId })) ?? [],

      sources: formData.sources?.filter(
        (source) => source != null && source.sourceUrl != null,
      ),
    },
  };
}

//
// Form Inputs
//

export function buildGpuFormInputs(product?: Product): ProductFormInputGroups {
  if (product != null && !isGpuProduct(product)) {
    throw new Error(
      `Invalid product type for buildGpuFormInputs: ${product?.productType}`,
    );
  }

  const inputs: ProductFormInputGroups = [
    // Sources
    {
      label: 'Sources',
      scraper: true,
      inputs: [{ name: 'sources', inputType: ProductFormInputType.Sources }],
    },

    // Product Info
    {
      label: 'Product Info',
      inputs: [
        {
          name: 'parentId',
          fieldLabel: 'Chipset',
          inputType: ProductFormInputType.Parent,
        },
        {
          name: 'name',
          fieldLabel: 'Name',
          inputType: ProductFormInputType.Text,
        },
        {
          name: 'company',
          fieldLabel: 'Company',
          inputType: ProductFormInputType.Text,
        },
        {
          name: 'slug',
          fieldLabel: 'Slug',
          inputType: ProductFormInputType.Slug,
        },
        {
          name: 'searchText',
          fieldLabel: 'Searchable Text',
          inputType: ProductFormInputType.SearchText,
        },
        {
          name: 'otherNames',
          fieldLabel: 'Other Names',
          inputType: ProductFormInputType.Slug,
        },
        {
          name: 'affiliateUrl',
          fieldLabel: 'Amazon URL',
          inputType: ProductFormInputType.Text,
        },
      ],
    },

    // Summary
    {
      label: 'Summary',
      inputs: [
        {
          name: 'summary',
          inputType: ProductFormInputType.Summary,
          placeholder: 'Add product summary',
        },
      ],
    },

    // General Info
    {
      label: 'General Info',
      inputs: [
        {
          name: 'partNumber',
          label: 'Part Number',
          inputType: ProductFormInputType.TextField,
          fieldKey: 'partNumber',
        },
        {
          name: 'marketSegment',
          inputType: ProductFormInputType.EnumField,
          label: 'Market Segment',
          fieldKey: 'marketSegment',
          items: [
            {
              label: formatMarketSegment(MarketSegment.Desktop),
              value: MarketSegment.Desktop,
            },
            {
              label: formatMarketSegment(MarketSegment.Mobile),
              value: MarketSegment.Mobile,
            },
            {
              label: formatMarketSegment(MarketSegment.Workstation),
              value: MarketSegment.Workstation,
            },
            {
              label: formatMarketSegment(MarketSegment.Server),
              value: MarketSegment.Server,
            },
            {
              label: formatMarketSegment(MarketSegment.Embedded),
              value: MarketSegment.Embedded,
            },
          ],
          formatter: (value: SelectValue) =>
            formatMarketSegment(value as MarketSegment),
        },
        {
          name: 'msrp',
          inputType: ProductFormInputType.FloatField,
          label: 'MSRP',
          fieldKey: 'msrp',
          units: [CurrencyUnit.USD],
        },
        {
          name: 'releaseDate',
          inputType: ProductFormInputType.DateField,
          label: 'Release Date',
          fieldKey: 'releaseDate',
        },
        {
          name: 'productionStatus',
          inputType: ProductFormInputType.EnumField,
          label: 'Production Status',
          fieldKey: 'productionStatus',
          items: [
            {
              label: formatProductionStatus(ProductionStatus.Unreleased),
              value: ProductionStatus.Unreleased,
            },
            {
              label: formatProductionStatus(ProductionStatus.Active),
              value: ProductionStatus.Active,
            },
            {
              label: formatProductionStatus(ProductionStatus.EndOfLife),
              value: ProductionStatus.EndOfLife,
            },
          ],
          formatter: (value: SelectValue) =>
            formatProductionStatus(value as ProductionStatus),
        },
      ],
    },

    // Processor
    {
      label: 'Processor',
      inputs: [
        {
          name: 'codename',
          inputType: ProductFormInputType.TextField,
          label: 'GPU Codename',
          fieldKey: 'codename',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.codename ?? undefined,
            ),
          }),
        },
        {
          name: 'architecture',
          inputType: ProductFormInputType.TextField,
          label: 'Architecture',
          fieldKey: 'architecture',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.architecture ?? undefined,
            ),
          }),
        },
        {
          name: 'processSize',
          inputType: ProductFormInputType.FloatField,
          label: 'Process Size',
          fieldKey: 'processSize',
          units: [LengthUnit.nm, LengthUnit.um],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.processSize ?? undefined,
            ),
          }),
        },
        {
          name: 'transistors',
          inputType: ProductFormInputType.FloatField,
          label: 'Transistors',
          fieldKey: 'transistors',
          units: [NumericUnit.million],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.transistors ?? undefined,
            ),
          }),
        },
      ],
    },

    // Memory
    {
      label: 'Memory',
      inputs: [
        {
          name: 'memorySize',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Size',
          fieldKey: 'memorySize',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.memorySize ?? undefined,
            ),
          }),
        },
        {
          name: 'memoryType',
          inputType: ProductFormInputType.TextField,
          label: 'Memory Type',
          fieldKey: 'memoryType',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.memoryType ?? undefined,
            ),
          }),
        },
        {
          name: 'memoryClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Clock',
          fieldKey: 'memoryClock',
          units: [FrequencyUnit.mhz],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.memoryClock ?? undefined,
            ),
          }),
        },
        {
          name: 'memoryInterface',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Interface',
          fieldKey: 'memoryInterface',
          units: [BitUnit.bit],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.memoryInterface ?? undefined,
            ),
          }),
        },
        {
          name: 'memoryBandwidth',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Bandwidth',
          fieldKey: 'memoryBandwidth',
          units: [BandwidthUnit.gbps, BandwidthUnit.mbps],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.memoryBandwidth ?? undefined,
            ),
          }),
        },
      ],
    },

    // Board Compatibility & Dimensions
    {
      label: 'Board Compatibility & Dimensions',
      inputs: [
        {
          name: 'slotWidth',
          inputType: ProductFormInputType.FloatField,
          label: 'Slots',
          fieldKey: 'slotWidth',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.slotWidth ?? undefined,
            ),
          }),
        },
        {
          name: 'length',
          inputType: ProductFormInputType.FloatField,
          label: 'Length',
          fieldKey: 'length',
          units: [LengthUnit.mm],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.length ?? undefined,
            ),
          }),
        },
        {
          name: 'width',
          inputType: ProductFormInputType.FloatField,
          label: 'Width',
          fieldKey: 'width',
          units: [LengthUnit.mm],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.width ?? undefined,
            ),
          }),
        },
        {
          name: 'height',
          inputType: ProductFormInputType.FloatField,
          label: 'Height',
          fieldKey: 'height',
          units: [LengthUnit.mm],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.height ?? undefined,
            ),
          }),
        },
        {
          name: 'weight',
          inputType: ProductFormInputType.FloatField,
          label: 'Weight',
          fieldKey: 'weight',
          units: [WeightUnit.kg],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.weight ?? undefined,
            ),
          }),
        },
        {
          name: 'busInterface',
          inputType: ProductFormInputType.TextField,
          label: 'Bus Interface',
          fieldKey: 'busInterface',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.busInterface ?? undefined,
            ),
          }),
        },
        {
          name: 'tdp',
          inputType: ProductFormInputType.FloatField,
          label: 'Thermal Design Power (TDP)',
          fieldKey: 'tdp',
          units: [WattageUnit.w],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.tdp ?? undefined,
            ),
          }),
        },
        {
          name: 'suggestedPsu',
          inputType: ProductFormInputType.FloatField,
          label: 'Suggested PSU',
          fieldKey: 'suggestedPsu',
          units: [WattageUnit.w],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.suggestedPsu ?? undefined,
            ),
          }),
        },
        {
          name: 'outputs',
          inputType: ProductFormInputType.TextField,
          label: 'Outputs',
          fieldKey: 'outputs',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.outputs ?? undefined,
            ),
          }),
        },
      ],
    },

    // Cores & Clock Speeds
    {
      label: 'Cores & Clock Speeds',
      inputs: [
        {
          name: 'gpuCores',
          inputType: ProductFormInputType.FloatField,
          label: 'GPU Cores (Shader Units / CUDA Cores)',
          fieldKey: 'gpuCores',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.gpuCores ?? undefined,
            ),
          }),
        },
        {
          name: 'computeUnits',
          inputType: ProductFormInputType.FloatField,
          label: 'Compute Units / SM Count',
          fieldKey: 'computeUnits',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.computeUnits ?? undefined,
            ),
          }),
        },
        {
          name: 'tmus',
          inputType: ProductFormInputType.FloatField,
          label: 'Texture Mapping Units (TMUs)',
          fieldKey: 'tmus',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.tmus ?? undefined,
            ),
          }),
        },
        {
          name: 'rops',
          inputType: ProductFormInputType.FloatField,
          label: 'Render Output Units (ROPs)',
          fieldKey: 'rops',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.rops ?? undefined,
            ),
          }),
        },
        {
          name: 'tensorCores',
          inputType: ProductFormInputType.FloatField,
          label: 'Tensor Cores',
          fieldKey: 'tensorCores',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.tensorCores ?? undefined,
            ),
          }),
        },
        {
          name: 'rtCores',
          inputType: ProductFormInputType.FloatField,
          label: 'Ray Tracing Cores (RT Cores)',
          fieldKey: 'rtCores',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.rtCores ?? undefined,
            ),
          }),
        },
        {
          name: 'gpuCoreBaseClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Clock Speed (Base)',
          fieldKey: 'gpuCoreBaseClock',
          units: [FrequencyUnit.mhz, FrequencyUnit.ghz],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.gpuCoreBaseClock ?? undefined,
            ),
          }),
        },
        {
          name: 'gpuCoreBoostClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Clock Speed (Boost)',
          fieldKey: 'gpuCoreBoostClock',
          units: [FrequencyUnit.mhz, FrequencyUnit.ghz],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.gpuCoreBoostClock ?? undefined,
            ),
          }),
        },
        {
          name: 'l1Cache',
          inputType: ProductFormInputType.FloatField,
          label: 'L1 Cache',
          fieldKey: 'l1Cache',
          units: [MemorySizeUnit.kb, MemorySizeUnit.mb],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.l1Cache ?? undefined,
            ),
          }),
        },
        {
          name: 'l2Cache',
          inputType: ProductFormInputType.FloatField,
          label: 'L2 Cache',
          fieldKey: 'l2Cache',
          units: [MemorySizeUnit.kb, MemorySizeUnit.mb],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.l2Cache ?? undefined,
            ),
          }),
        },
      ],
    },

    // Theoretical Performance
    {
      label: 'Theoretical Performance',
      inputs: [
        {
          name: 'pixelRate',
          inputType: ProductFormInputType.FloatField,
          label: 'Pixel Fill Rate',
          fieldKey: 'pixelRate',
          units: [PixelFillRateUnit.gpixelps],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.pixelRate ?? undefined,
            ),
          }),
        },
        {
          name: 'textureRate',
          inputType: ProductFormInputType.FloatField,
          label: 'Texture Fill Rate',
          fieldKey: 'textureRate',
          units: [TextureFillRateUnit.gtexelps],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.textureRate ?? undefined,
            ),
          }),
        },
        {
          name: 'fp32',
          inputType: ProductFormInputType.FloatField,
          label: 'FP32 Performance',
          fieldKey: 'fp32',
          units: [FlopsUnit.tflops, FlopsUnit.gflops],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.fp32 ?? undefined,
            ),
          }),
        },
        {
          name: 'fp64',
          inputType: ProductFormInputType.FloatField,
          label: 'FP64 Performance',
          fieldKey: 'fp64',
          units: [FlopsUnit.gflops, FlopsUnit.tflops],
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.fp64 ?? undefined,
            ),
          }),
        },
      ],
    },

    // API Support
    {
      label: 'API Support',
      inputs: [
        {
          name: 'directxVersion',
          inputType: ProductFormInputType.TextField,
          label: 'DirectX Version',
          fieldKey: 'directxVersion',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.directxVersion ?? undefined,
            ),
          }),
        },
        {
          name: 'openClVersion',
          inputType: ProductFormInputType.TextField,
          label: 'Open CL Version',
          fieldKey: 'openClVersion',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.openClVersion ?? undefined,
            ),
          }),
        },
        {
          name: 'openGlVersion',
          inputType: ProductFormInputType.TextField,
          label: 'Open GL Version',
          fieldKey: 'openGlVersion',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.openGlVersion ?? undefined,
            ),
          }),
        },
        {
          name: 'shaderModelVersion',
          inputType: ProductFormInputType.TextField,
          label: 'Shader Model Version',
          fieldKey: 'shaderModelVersion',
          overrides: (ctx) => ({
            placeholder: productFieldFormattedValue(
              ctx.parentProduct?.fields?.shaderModelVersion ?? undefined,
            ),
          }),
        },
      ],
    },

    // Benchmarks
    {
      label: 'Benchmarks',
      inputs: [
        {
          name: 'benchmarks',
          inputType: ProductFormInputType.Benchmarks,
        },
      ],
    },

    // Images
    {
      label: 'Images',
      inputs: [{ name: 'images', inputType: ProductFormInputType.Images }],
    },
  ];

  return inputs;
}
