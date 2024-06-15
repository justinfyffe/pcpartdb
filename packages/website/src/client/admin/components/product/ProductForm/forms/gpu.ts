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
  productFieldSchema,
  ProductGame,
  ProductGameFps,
  productGameSchema,
  ProductImage,
  productImageSchema,
  ProductionStatus,
  ProductSource,
  productSourceSchema,
  ProductType,
  TextureFillRateUnit,
  UpdateProductRequest,
  WattageUnit,
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
  name: string;
  slug: string;

  company?: string;
  otherNames?: string[];
  searchText?: string;
  affiliateUrl?: string;
  summary?: string;
  summaryStale?: boolean;
  enablePerformanceSummary?: boolean;

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
  busInterface?: GpuField<string>;
  tdp?: GpuField<number>;
  suggestedPsu?: GpuField<number>;
  powerConnectors?: GpuField<string>;
  outputs?: GpuField<string>;

  // Cores & Clock Speeds
  streamProcessors?: GpuField<number>;
  shadingUnits?: GpuField<number>;
  cudaCores?: GpuField<number>;
  //
  computeUnits?: GpuField<number>;
  executionUnits?: GpuField<number>;
  streamMultiprocessors?: GpuField<number>;
  //
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
  memoryClockEffective?: GpuField<number>;
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

  // Games
  games?: ProductGame[];
}

//
// Form Options
//

const gpuFormSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  company: Joi.string(),
  otherNames: Joi.array().items(Joi.string()).allow(null),
  searchText: Joi.string().allow(null),
  affiliateUrl: Joi.string().allow(null),
  summary: Joi.string().allow(null),
  summaryStale: Joi.boolean().allow(null),
  enablePerformanceSummary: Joi.boolean().allow(null),

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
  busInterface: productFieldSchema.allow(null),
  tdp: productFieldSchema.allow(null),
  suggestedPsu: productFieldSchema.allow(null),
  powerConnectors: productFieldSchema.allow(null),
  outputs: productFieldSchema.allow(null),

  // Cores & Clock Speed
  streamProcessors: productFieldSchema.allow(null),
  shadingUnits: productFieldSchema.allow(null),
  cudaCores: productFieldSchema.allow(null),
  //
  computeUnits: productFieldSchema.allow(null),
  executionUnits: productFieldSchema.allow(null),
  streamMultiprocessors: productFieldSchema.allow(null),
  //
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
  memoryClockEffective: productFieldSchema.allow(null),
  memoryInterface: productFieldSchema.allow(null),
  memoryBandwidth: productFieldSchema.allow(null),

  // API Support
  directxVersion: productFieldSchema.allow(null),
  openClVersion: productFieldSchema.allow(null),
  openGlVersion: productFieldSchema.allow(null),
  shaderModelVersion: productFieldSchema.allow(null),

  // Benchmarks
  benchmarks: Joi.array().items(productBenchmarkSchema),

  // Game
  games: Joi.array().items(productGameSchema),

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
  const games = product?.games || [];
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
      summaryStale: product?.summaryStale ?? null,
      enablePerformanceSummary: product?.enablePerformanceSummary ?? null,

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
      busInterface: product?.fields?.busInterface ?? null,
      tdp: product?.fields?.tdp ?? null,
      suggestedPsu: product?.fields?.suggestedPsu ?? null,
      powerConnectors: product?.fields?.powerConnectors ?? null,
      outputs: product?.fields?.outputs ?? null,

      // Cores & Clock Speeds
      streamProcessors: product?.fields?.streamProcessors ?? null,
      shadingUnits: product?.fields?.shadingUnits ?? null,
      cudaCores: product?.fields?.cudaCores ?? null,
      computeUnits: product?.fields?.computeUnits ?? null,
      executionUnits: product?.fields?.executionUnits ?? null,
      streamMultiprocessors: product?.fields?.streamMultiprocessors ?? null,
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
      memoryClockEffective: product?.fields?.memoryClockEffective ?? null,
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

      // Games
      games,
    },
  };
}

//
// Form Data Structure to Request Conversion
//

export function formDataToGpuRequest(
  formData: GpuFormData,
): CreateProductRequest | UpdateProductRequest {
  // Clean up game data by removing empty FPS values.
  const games = formData.games?.reduce((acc, game) => {
    if (game == null) {
      return acc;
    }

    const sanitized = { ...game, fps: [] as ProductGameFps[] };
    for (const fpsItem of game.fps) {
      if (
        fpsItem != null &&
        fpsItem.fps != null &&
        !Number.isNaN(fpsItem.fps)
      ) {
        sanitized.fps.push(fpsItem);
      }
    }

    acc.push(sanitized);
    return acc;
  }, [] as ProductGame[]);

  return {
    product: {
      productType: ProductType.Gpu,
      slug: formData.slug,
      name: formData.name,
      company: formData.company,
      otherNames: formData.otherNames,
      searchText: formData.searchText,
      affiliateUrl: formData.affiliateUrl,

      summary: formData.summary,
      summaryStale: formData.summaryStale,
      enablePerformanceSummary: formData.enablePerformanceSummary,

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
        busInterface: formData.busInterface ?? null,
        tdp: formData.tdp ?? null,
        suggestedPsu: formData.suggestedPsu ?? null,
        powerConnectors: formData.powerConnectors ?? null,
        outputs: formData.outputs ?? null,

        // Cores & Clock Speeds
        streamProcessors: formData.streamProcessors ?? null,
        shadingUnits: formData.shadingUnits ?? null,
        cudaCores: formData.cudaCores ?? null,
        computeUnits: formData.computeUnits ?? null,
        executionUnits: formData.executionUnits ?? null,
        streamMultiprocessors: formData.streamMultiprocessors ?? null,
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
        memoryClockEffective: formData.memoryClockEffective ?? null,
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

      games,

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
        {
          name: 'enablePerformanceSummary',
          label: 'Generate Performance Summary?',
          inputType: ProductFormInputType.Boolean,
        },
        {
          name: 'summaryStale',
          label: 'Is Summary Possibly Stale?',
          inputType: ProductFormInputType.Boolean,
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
              label: formatMarketSegment(MarketSegment.Integrated),
              value: MarketSegment.Integrated,
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
        },
        {
          name: 'architecture',
          inputType: ProductFormInputType.TextField,
          label: 'Architecture',
          fieldKey: 'architecture',
        },
        {
          name: 'processSize',
          inputType: ProductFormInputType.FloatField,
          label: 'Process Size',
          fieldKey: 'processSize',
          units: [LengthUnit.nm, LengthUnit.um],
        },
        {
          name: 'transistors',
          inputType: ProductFormInputType.FloatField,
          label: 'Transistors',
          fieldKey: 'transistors',
          units: [NumericUnit.million],
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
        },
        {
          name: 'memoryType',
          inputType: ProductFormInputType.TextField,
          label: 'Memory Type',
          fieldKey: 'memoryType',
        },
        {
          name: 'memoryClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Clock',
          fieldKey: 'memoryClock',
          units: [FrequencyUnit.mhz, FrequencyUnit.ghz],
        },
        {
          name: 'memoryClockEffective',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Clock (Effective)',
          fieldKey: 'memoryClockEffective',
          units: [FrequencyUnit.mhz, FrequencyUnit.ghz],
        },
        {
          name: 'memoryInterface',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Interface',
          fieldKey: 'memoryInterface',
          units: [BitUnit.bit],
        },
        {
          name: 'memoryBandwidth',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Bandwidth',
          fieldKey: 'memoryBandwidth',
          units: [BandwidthUnit.tbps, BandwidthUnit.gbps, BandwidthUnit.mbps],
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
        },
        {
          name: 'busInterface',
          inputType: ProductFormInputType.TextField,
          label: 'Bus Interface',
          fieldKey: 'busInterface',
        },
        {
          name: 'tdp',
          inputType: ProductFormInputType.FloatField,
          label: 'Thermal Design Power (TDP)',
          fieldKey: 'tdp',
          units: [WattageUnit.w],
        },
        {
          name: 'suggestedPsu',
          inputType: ProductFormInputType.FloatField,
          label: 'Suggested PSU',
          fieldKey: 'suggestedPsu',
          units: [WattageUnit.w],
        },
        {
          name: 'outputs',
          inputType: ProductFormInputType.TextField,
          label: 'Outputs',
          fieldKey: 'outputs',
        },
      ],
    },

    // Cores & Clock Speeds
    {
      label: 'Cores & Clock Speeds',
      inputs: [
        // Stream Processors (AMD), Shading Units (Intel), CUDA Cores (AMD), Shaders: Equivalent
        {
          name: 'streamProcessors',
          inputType: ProductFormInputType.FloatField,
          label: 'Stream Processors (AMD)',
          fieldKey: 'streamProcessors',
        },
        {
          name: 'shadingUnits',
          inputType: ProductFormInputType.FloatField,
          label: 'Shading Units (Intel)',
          fieldKey: 'shadingUnits',
        },
        {
          name: 'cudaCores',
          inputType: ProductFormInputType.FloatField,
          label: 'CUDA Cores (NVIDIA)',
          fieldKey: 'cudaCores',
        },
        // Compute Units (AMD), Execution Units (Intel), Stream Multiprocessors (NVIDIA): Equivalent
        {
          name: 'computeUnits',
          inputType: ProductFormInputType.FloatField,
          label: 'Compute Units (AMD)',
          fieldKey: 'computeUnits',
        },
        {
          name: 'executionUnits',
          inputType: ProductFormInputType.FloatField,
          label: 'Execution Units (Intel)',
          fieldKey: 'executionUnits',
        },
        {
          name: 'streamMultiprocessors',
          inputType: ProductFormInputType.FloatField,
          label: 'Stream Multiprocessors (NVIDIA)',
          fieldKey: 'streamMultiprocessors',
        },
        {
          name: 'tmus',
          inputType: ProductFormInputType.FloatField,
          label: 'Texture Mapping Units (TMUs)',
          fieldKey: 'tmus',
        },
        {
          name: 'rops',
          inputType: ProductFormInputType.FloatField,
          label: 'Render Output Units (ROPs)',
          fieldKey: 'rops',
        },
        {
          name: 'tensorCores',
          inputType: ProductFormInputType.FloatField,
          label: 'Tensor Cores',
          fieldKey: 'tensorCores',
        },
        {
          name: 'rtCores',
          inputType: ProductFormInputType.FloatField,
          label: 'Ray Tracing Cores (RT Cores)',
          fieldKey: 'rtCores',
        },
        {
          name: 'gpuCoreBaseClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Core Clock Speed',
          fieldKey: 'gpuCoreBaseClock',
          units: [FrequencyUnit.mhz, FrequencyUnit.ghz],
        },
        {
          name: 'gpuCoreBoostClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Core Clock Speed (Boost)',
          fieldKey: 'gpuCoreBoostClock',
          units: [FrequencyUnit.mhz, FrequencyUnit.ghz],
        },
        {
          name: 'l1Cache',
          inputType: ProductFormInputType.FloatField,
          label: 'L1 Cache',
          fieldKey: 'l1Cache',
          units: [
            MemorySizeUnit.kb,
            MemorySizeUnit.mb,
            MemorySizeUnit.gb,
            MemorySizeUnit.tb,
          ],
        },
        {
          name: 'l2Cache',
          inputType: ProductFormInputType.FloatField,
          label: 'L2 Cache',
          fieldKey: 'l2Cache',
          units: [
            MemorySizeUnit.kb,
            MemorySizeUnit.mb,
            MemorySizeUnit.gb,
            MemorySizeUnit.tb,
          ],
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
        },
        {
          name: 'textureRate',
          inputType: ProductFormInputType.FloatField,
          label: 'Texture Fill Rate',
          fieldKey: 'textureRate',
          units: [TextureFillRateUnit.gtexelps],
        },
        {
          name: 'fp32',
          inputType: ProductFormInputType.FloatField,
          label: 'FP32 Performance',
          fieldKey: 'fp32',
          units: [FlopsUnit.tflops, FlopsUnit.gflops],
        },
        {
          name: 'fp64',
          inputType: ProductFormInputType.FloatField,
          label: 'FP64 Performance',
          fieldKey: 'fp64',
          units: [FlopsUnit.gflops, FlopsUnit.tflops],
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
        },
        {
          name: 'openClVersion',
          inputType: ProductFormInputType.TextField,
          label: 'Open CL Version',
          fieldKey: 'openClVersion',
        },
        {
          name: 'openGlVersion',
          inputType: ProductFormInputType.TextField,
          label: 'Open GL Version',
          fieldKey: 'openGlVersion',
        },
        {
          name: 'shaderModelVersion',
          inputType: ProductFormInputType.TextField,
          label: 'Shader Model Version',
          fieldKey: 'shaderModelVersion',
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

    // Games
    {
      label: 'Games',
      inputs: [
        {
          name: 'games',
          inputType: ProductFormInputType.Games,
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
