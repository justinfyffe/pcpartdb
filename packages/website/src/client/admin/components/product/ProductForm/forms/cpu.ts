import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  CpuField,
  CreateProductRequest,
  CurrencyUnit,
  formatCompanyName,
  formatMarketSegment,
  formatProductionStatus,
  FrequencyUnit,
  isCpuProduct,
  LengthUnit,
  MarketSegment,
  MemorySizeUnit,
  NumericUnit,
  Product,
  ProductBenchmark,
  productBenchmarkSchema,
  productFieldSchema,
  ProductImage,
  productImageSchema,
  ProductionStatus,
  ProductSource,
  productSourceSchema,
  ProductType,
  TemperatureUnit,
  UpdateProductRequest,
  WattageUnit,
} from '@pcpartdb/shared';
import { SelectValue } from 'packages/website/src/client/shared/components/Select/Select';
import { UseFormProps } from 'react-hook-form';
import { ProductFormInputGroups, ProductFormInputType } from '../types';

//
// Form Data Structure
//

export interface CpuFormData {
  name: string;
  slug: string;
  company?: string;
  otherNames?: string[];
  searchText?: string;
  affiliateUrl?: string;

  // General Info
  partNumber?: CpuField<string>;
  marketSegment?: CpuField<MarketSegment>;
  msrp?: CpuField<number>;
  releaseDate?: CpuField<string>;
  productionStatus?: CpuField<ProductionStatus>;
  bundledCooler?: CpuField<string>;

  //
  socket?: CpuField<string>;
  foundry?: CpuField<string>;
  processSize?: CpuField<number>;
  transistors?: CpuField<number>;
  tCaseMax?: CpuField<number>; // Max case temperature
  tjMax?: CpuField<number>; // Max core temperature

  //
  architecture?: CpuField<string>;
  codename?: CpuField<string>;
  generation?: CpuField<string>;
  pciExpress?: CpuField<string>;
  chipsets?: CpuField<string>;

  //
  memorySupport?: CpuField<string>;
  memoryChannels?: CpuField<number>;
  eccMemory?: CpuField<boolean>;

  //
  cores?: CpuField<number>;
  threads?: CpuField<number>;
  pCores?: CpuField<number>;
  eCores?: CpuField<number>;
  clock?: CpuField<number>;
  turboClock?: CpuField<number>;
  pCoreClock?: CpuField<number>;
  pCoreTurboClock?: CpuField<number>;
  eCoreClock?: CpuField<number>;
  eCoreTurboClock?: CpuField<number>;
  baseClock?: CpuField<number>;
  multiplier?: CpuField<number>;
  multiplierUnlocked?: CpuField<boolean>;

  //
  tdp?: CpuField<number>;
  pl1?: CpuField<number>;
  pl2?: CpuField<number>;
  ppt: CpuField<number>;

  //
  l1Cache?: CpuField<number>;
  l2Cache?: CpuField<number>;
  l3Cache?: CpuField<number>;
  eCoreL1Cache?: CpuField<number>;
  eCoreL2Cache?: CpuField<number>;

  // Graphics
  integratedGraphics?: CpuField<string>;

  // Features
  extensionsTechnologies?: CpuField<string>;

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

const cpuFormSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  company: Joi.string(),
  otherNames: Joi.array().items(Joi.string()).allow(null),
  searchText: Joi.string().allow(null),
  affiliateUrl: Joi.string().allow(null),

  // General Info
  partNumber: productFieldSchema.allow(null),
  marketSegment: productFieldSchema.allow(null),
  msrp: productFieldSchema.allow(null),
  releaseDate: productFieldSchema.allow(null),
  productionStatus: productFieldSchema.allow(null),
  bundledCooler: productFieldSchema.allow(null),

  // Physical
  socket: productFieldSchema.allow(null),
  foundry: productFieldSchema.allow(null),
  processSize: productFieldSchema.allow(null),
  transistors: productFieldSchema.allow(null),
  tCaseMax: productFieldSchema.allow(null),
  tjMax: productFieldSchema.allow(null),

  // Technical
  architecture: productFieldSchema.allow(null),
  codename: productFieldSchema.allow(null),
  generation: productFieldSchema.allow(null),
  pciExpress: productFieldSchema.allow(null),
  chipsets: productFieldSchema.allow(null),

  // Memory
  memorySupport: productFieldSchema.allow(null),
  memoryChannels: productFieldSchema.allow(null),
  eccMemory: productFieldSchema.allow(null),

  // Cores & Clock Speed
  cores: productFieldSchema.allow(null),
  threads: productFieldSchema.allow(null),
  pCores: productFieldSchema.allow(null),
  eCores: productFieldSchema.allow(null),
  clock: productFieldSchema.allow(null),
  turboClock: productFieldSchema.allow(null),
  pCoreClock: productFieldSchema.allow(null),
  pCoreTurboClock: productFieldSchema.allow(null),
  eCoreClock: productFieldSchema.allow(null),
  eCoreTurboClock: productFieldSchema.allow(null),
  baseClock: productFieldSchema.allow(null),
  multiplier: productFieldSchema.allow(null),
  multiplierUnlocked: productFieldSchema.allow(null),

  // Power Consumption
  tdp: productFieldSchema.allow(null),
  pl1: productFieldSchema.allow(null),
  pl2: productFieldSchema.allow(null),
  ppt: productFieldSchema.allow(null),

  // Cache
  l1Cache: productFieldSchema.allow(null),
  l2Cache: productFieldSchema.allow(null),
  l3Cache: productFieldSchema.allow(null),
  eCoreL1Cache: productFieldSchema.allow(null),
  eCoreL2Cache: productFieldSchema.allow(null),

  // Graphics
  integratedGraphics: productFieldSchema.allow(null),

  // Features
  extensionsTechnologies: productFieldSchema.allow(null),

  // Sources
  sources: Joi.array().items(productSourceSchema),

  // Benchmarks
  benchmarks: Joi.array().items(productBenchmarkSchema),

  // Images
  images: Joi.array().items(productImageSchema),
}).options({ abortEarly: false });

export function cpuFormOptions(product?: Product): UseFormProps<CpuFormData> {
  if (product != null && !isCpuProduct(product)) {
    throw new Error(
      `Invalid product type for cpuFormOptions: ${product?.productType}`,
    );
  }

  const benchmarks = product?.benchmarks || [];
  const sources = product?.sources || [];
  const images = product?.images || [];

  return {
    resolver: joiResolver(cpuFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: product?.name ?? null,
      slug: product?.slug ?? null,
      company: product?.company ?? null,
      otherNames: product?.otherNames || [],
      searchText: product?.searchText ?? null,
      affiliateUrl: product?.affiliateUrl ?? null,

      // Data Sources
      sources,

      // General Info
      partNumber: product?.fields?.partNumber ?? null,
      marketSegment: product?.fields?.marketSegment ?? null,
      msrp: product?.fields?.msrp ?? null,
      releaseDate: product?.fields?.releaseDate ?? null,
      productionStatus: product?.fields?.productionStatus ?? null,
      bundledCooler: product?.fields?.bundledCooler ?? null,

      // Physical Specs
      socket: product?.fields?.socket ?? null,
      foundry: product?.fields?.foundry ?? null,
      processSize: product?.fields?.processSize ?? null,
      transistors: product?.fields?.transistors ?? null,
      tCaseMax: product?.fields?.tCaseMax ?? null,
      tjMax: product?.fields?.tjMax ?? null,

      // Technical Specs
      architecture: product?.fields?.architecture ?? null,
      codename: product?.fields?.codename ?? null,
      generation: product?.fields?.generation ?? null,
      pciExpress: product?.fields?.pciExpress ?? null,
      chipsets: product?.fields?.chipsets ?? null,

      // Memory Specs
      memorySupport: product?.fields?.memorySupport ?? null,
      memoryChannels: product?.fields?.memoryChannels ?? null,
      eccMemory: product?.fields?.eccMemory ?? null,

      // Processing Specs
      cores: product?.fields?.cores ?? null,
      threads: product?.fields?.threads ?? null,
      pCores: product?.fields?.pCores ?? null,
      eCores: product?.fields?.eCores ?? null,

      // Clock Speed Specs
      clock: product?.fields?.clock ?? null,
      turboClock: product?.fields?.turboClock ?? null,
      pCoreClock: product?.fields?.pCoreClock ?? null,
      pCoreTurboClock: product?.fields?.pCoreTurboClock ?? null,
      eCoreClock: product?.fields?.eCoreClock ?? null,
      eCoreTurboClock: product?.fields?.eCoreTurboClock ?? null,
      baseClock: product?.fields?.baseClock ?? null,
      multiplier: product?.fields?.multiplier ?? null,
      multiplierUnlocked: product?.fields?.multiplierUnlocked ?? null,

      // Power Specs
      tdp: product?.fields?.tdp ?? null,
      pl1: product?.fields?.pl1 ?? null,
      pl2: product?.fields?.pl2 ?? null,
      ppt: product?.fields?.ppt ?? null,

      // Cache Specs
      l1Cache: product?.fields?.l1Cache ?? null,
      l2Cache: product?.fields?.l2Cache ?? null,
      l3Cache: product?.fields?.l3Cache ?? null,
      eCoreL1Cache: product?.fields?.eCoreL1Cache ?? null,
      eCoreL2Cache: product?.fields?.eCoreL2Cache ?? null,

      // Graphics & Features
      integratedGraphics: product?.fields?.integratedGraphics ?? null,
      extensionsTechnologies: product?.fields?.extensionsTechnologies ?? null,

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

export function formDataToCpuRequest(
  formData: CpuFormData,
): CreateProductRequest | UpdateProductRequest {
  return {
    product: {
      productType: ProductType.Cpu,
      slug: formData.slug,
      name: formData.name,
      company: formatCompanyName(formData.company),
      otherNames: formData.otherNames,
      searchText: formData.searchText,
      affiliateUrl: formData.affiliateUrl,

      // Product Fields
      fields: {
        // General Info
        partNumber: formData.partNumber || null,
        marketSegment: formData.marketSegment || null,
        msrp: formData.msrp || null,
        releaseDate: formData.releaseDate || null,
        productionStatus: formData.productionStatus || null,
        bundledCooler: formData.bundledCooler || null,

        //
        socket: formData.socket || null,
        foundry: formData.foundry || null,
        processSize: formData.processSize || null,
        transistors: formData.transistors || null,
        tCaseMax: formData.tCaseMax || null,
        tjMax: formData.tjMax || null,

        //
        architecture: formData.architecture || null,
        codename: formData.codename || null,
        generation: formData.generation || null,
        pciExpress: formData.pciExpress || null,
        chipsets: formData.chipsets || null,

        //
        memorySupport: formData.memorySupport || null,
        memoryChannels: formData.memoryChannels || null,
        eccMemory: formData.eccMemory || null,

        //
        cores: formData.cores || null,
        threads: formData.threads || null,
        pCores: formData.pCores || null,
        eCores: formData.eCores || null,
        clock: formData.clock || null,
        turboClock: formData.turboClock || null,
        pCoreClock: formData.pCoreClock || null,
        pCoreTurboClock: formData.pCoreTurboClock || null,
        eCoreClock: formData.eCoreClock || null,
        eCoreTurboClock: formData.eCoreTurboClock || null,
        baseClock: formData.baseClock || null,
        multiplier: formData.multiplier || null,
        multiplierUnlocked: formData.multiplierUnlocked || null,

        //
        tdp: formData.tdp || null,
        pl1: formData.pl1 || null,
        pl2: formData.pl2 || null,
        ppt: formData.ppt || null,

        //
        l1Cache: formData.l1Cache || null,
        l2Cache: formData.l2Cache || null,
        l3Cache: formData.l3Cache || null,
        eCoreL1Cache: formData.eCoreL1Cache || null,
        eCoreL2Cache: formData.eCoreL2Cache || null,

        // Graphics
        integratedGraphics: formData.integratedGraphics || null,

        // Features
        extensionsTechnologies: formData.extensionsTechnologies || null,
      },

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

export function buildCpuFormInputs(product?: Product): ProductFormInputGroups {
  if (product != null && !isCpuProduct(product)) {
    throw new Error(
      `Invalid product type for buildCpuFormInputs: ${product?.productType}`,
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
          inputType: ProductFormInputType.Text,
          fieldLabel: 'Name',
        },
        {
          name: 'company',
          inputType: ProductFormInputType.Text,
          fieldLabel: 'Company',
        },
        {
          name: 'slug',
          inputType: ProductFormInputType.Slug,
          fieldLabel: 'Slug',
        },
        {
          name: 'searchText',
          inputType: ProductFormInputType.SearchText,
          fieldLabel: 'Searchable Text',
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

    // General Info
    {
      label: 'General Info',
      inputs: [
        {
          name: 'partNumber',
          inputType: ProductFormInputType.TextField,
          label: 'Part Number',
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
        {
          name: 'bundledCooler',
          inputType: ProductFormInputType.TextField,
          label: 'Bundled Cooler',
          fieldKey: 'bundledCooler',
        },
      ],
    },

    // Physical
    {
      label: 'Physical',
      inputs: [
        {
          name: 'socket',
          inputType: ProductFormInputType.TextField,
          label: 'Socket',
          fieldKey: 'socket',
        },
        {
          name: 'foundry',
          inputType: ProductFormInputType.TextField,
          label: 'Foundry',
          fieldKey: 'foundry',
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
        {
          name: 'tCaseMax',
          inputType: ProductFormInputType.FloatField,
          label: 'TCase Max Temperature',
          fieldKey: 'tCaseMax',
          units: [TemperatureUnit.c],
        },
        {
          name: 'tjMax',
          inputType: ProductFormInputType.FloatField,
          label: 'TJ Max Temperature',
          fieldKey: 'tjMax',
          units: [TemperatureUnit.c],
        },
      ],
    },

    // Technical
    {
      label: 'Technical',
      inputs: [
        {
          name: 'architecture',
          inputType: ProductFormInputType.TextField,
          label: 'Architecture',
          fieldKey: 'architecture',
        },
        {
          name: 'codename',
          inputType: ProductFormInputType.TextField,
          label: 'Codename',
          fieldKey: 'codename',
        },
        {
          name: 'generation',
          inputType: ProductFormInputType.TextField,
          label: 'Series',
          fieldKey: 'generation',
        },
        {
          name: 'pciExpress',
          inputType: ProductFormInputType.TextField,
          label: 'PCI Express',
          fieldKey: 'pciExpress',
        },
        {
          name: 'chipsets',
          inputType: ProductFormInputType.TextField,
          label: 'Chipsets',
          fieldKey: 'chipsets',
        },
      ],
    },

    // Memory
    {
      label: 'Memory',
      inputs: [
        {
          name: 'memorySupport',
          inputType: ProductFormInputType.TextField,
          label: 'Memory Support',
          fieldKey: 'memorySupport',
        },
        {
          name: 'memoryChannels',
          inputType: ProductFormInputType.FloatField,
          label: 'Memory Channels',
          fieldKey: 'memoryChannels',
        },
        {
          name: 'eccMemory',
          inputType: ProductFormInputType.BooleanField,
          label: 'ECC Memory',
          fieldKey: 'eccMemory',
        },
      ],
    },

    // Cores & Clock Speed
    {
      label: 'Cores & Clock Speed',
      inputs: [
        {
          name: 'cores',
          inputType: ProductFormInputType.FloatField,
          label: 'Cores Count',
          fieldKey: 'cores',
        },
        {
          name: 'threads',
          inputType: ProductFormInputType.FloatField,
          label: 'Threads Count',
          fieldKey: 'threads',
        },
        {
          name: 'pCores',
          inputType: ProductFormInputType.FloatField,
          label: 'Performance Cores (P-Cores) Count',
          fieldKey: 'pCores',
        },
        {
          name: 'eCores',
          inputType: ProductFormInputType.FloatField,
          label: 'Performance Cores (P-Cores) Count',
          fieldKey: 'pCores',
        },
        {
          name: 'clock',
          inputType: ProductFormInputType.FloatField,
          label: 'Clock',
          fieldKey: 'clock',
          units: [FrequencyUnit.ghz, FrequencyUnit.mhz],
        },
        {
          name: 'turboClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Turbo Clock',
          fieldKey: 'turboClock',
          units: [FrequencyUnit.ghz, FrequencyUnit.mhz],
        },
        {
          name: 'pCoreClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Performance Core (P-Core) Clock',
          fieldKey: 'pCoreClock',
          units: [FrequencyUnit.ghz, FrequencyUnit.mhz],
        },
        {
          name: 'pCoreTurboClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Performance Core (P-Core) Turbo Clock',
          fieldKey: 'pCoreTurboClock',
          units: [FrequencyUnit.ghz, FrequencyUnit.mhz],
        },
        {
          name: 'eCoreClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Efficient Core (E-Core) Clock',
          fieldKey: 'eCoreClock',
          units: [FrequencyUnit.ghz, FrequencyUnit.mhz],
        },
        {
          name: 'eCoreTurboClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Efficient Core (E-Core) Turbo Clock',
          fieldKey: 'eCoreTurboClock',
          units: [FrequencyUnit.ghz, FrequencyUnit.mhz],
        },
        {
          name: 'baseClock',
          inputType: ProductFormInputType.FloatField,
          label: 'Base Clock',
          fieldKey: 'baseClock',
          units: [FrequencyUnit.mhz],
        },
        {
          name: 'multiplier',
          inputType: ProductFormInputType.FloatField,
          label: 'Clock Multiplier',
          fieldKey: 'multiplier',
          units: [FrequencyUnit.mhz],
        },
        {
          name: 'multiplierUnlocked',
          inputType: ProductFormInputType.BooleanField,
          label: 'Multiplier Unlocked',
          fieldKey: 'multiplierUnlocked',
          units: [FrequencyUnit.mhz],
        },
      ],
    },

    // Power Consumption
    {
      label: 'Power Consumption',
      inputs: [
        {
          name: 'tdp',
          inputType: ProductFormInputType.FloatField,
          label: 'TDP',
          fieldKey: 'tdp',
          units: [WattageUnit.w],
        },
        {
          name: 'pl1',
          inputType: ProductFormInputType.FloatField,
          label: 'PL1',
          fieldKey: 'pl1',
          units: [WattageUnit.w],
        },
        {
          name: 'pl2',
          inputType: ProductFormInputType.FloatField,
          label: 'PL2',
          fieldKey: 'pl2',
          units: [WattageUnit.w],
        },
        {
          name: 'ppt',
          inputType: ProductFormInputType.FloatField,
          label: 'PPT',
          fieldKey: 'ppt',
          units: [WattageUnit.w],
        },
      ],
    },

    // Cache
    {
      label: 'Cache',
      inputs: [
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
        {
          name: 'l3Cache',
          inputType: ProductFormInputType.FloatField,
          label: 'L3 Cache',
          fieldKey: 'l3Cache',
          units: [
            MemorySizeUnit.kb,
            MemorySizeUnit.mb,
            MemorySizeUnit.gb,
            MemorySizeUnit.tb,
          ],
        },
        {
          name: 'eCoreL1Cache',
          inputType: ProductFormInputType.FloatField,
          label: 'Efficient Core (E-Core) L1 Cache',
          fieldKey: 'eCoreL1Cache',
          units: [
            MemorySizeUnit.kb,
            MemorySizeUnit.mb,
            MemorySizeUnit.gb,
            MemorySizeUnit.tb,
          ],
        },
        {
          name: 'eCoreL2Cache',
          inputType: ProductFormInputType.FloatField,
          label: 'Efficient Core (E-Core) L2 Cache',
          fieldKey: 'eCoreL2Cache',
          units: [
            MemorySizeUnit.kb,
            MemorySizeUnit.mb,
            MemorySizeUnit.gb,
            MemorySizeUnit.tb,
          ],
        },
      ],
    },

    // Graphics & Features
    {
      label: 'Graphics & Features',
      inputs: [
        {
          name: 'integratedGraphics',
          inputType: ProductFormInputType.TextField,
          label: 'Integrated Graphics',
          fieldKey: 'integratedGraphics',
        },
        {
          name: 'extensionsTechnologies',
          inputType: ProductFormInputType.TextField,
          label: 'Extenisons / Technologies',
          fieldKey: 'extensionsTechnologies',
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
