import Joi from '@hapi/joi';
import {
  BenchmarKey,
  MarketSegment,
  ProductType,
  ProductUpdateStatus,
  SubProductType,
} from '../product';
import { listQuerySchema } from './common';

export const productTypeSchema = Joi.string().valid(
  ProductType.Cpu,
  ProductType.Gpu,
);

export const subProductTypeSchema = Joi.string().valid(
  SubProductType.GpuChipset,
  SubProductType.GpuRetailModel,
);

export const marketSegmentSchema = Joi.string().valid(
  MarketSegment.Desktop,
  MarketSegment.Embedded,
  MarketSegment.Integrated,
  MarketSegment.Mobile,
  MarketSegment.Server,
  MarketSegment.Workstation,
);

export const productUpdateStatusSchema = Joi.string().valid(
  ProductUpdateStatus.Approved,
  ProductUpdateStatus.Pending,
  ProductUpdateStatus.Rejected,
);

export const productFieldKeySchema = Joi.string();

export const productFieldSchema = Joi.object({
  value: Joi.any().allow(null),
  meta: Joi.any().allow(null),
});

export const productFieldsSchema = Joi.object({
  id: Joi.number().allow(null),
  productId: Joi.number().allow(null),

  architecture: productFieldSchema.allow(null),
  baseClock: productFieldSchema.allow(null),
  bundledCooler: productFieldSchema.allow(null),
  busInterface: productFieldSchema.allow(null),
  chipsets: productFieldSchema.allow(null),
  clock: productFieldSchema.allow(null),
  codename: productFieldSchema.allow(null),
  company: productFieldSchema.allow(null),
  computeUnits: productFieldSchema.allow(null),
  cores: productFieldSchema.allow(null),
  cudaVersion: productFieldSchema.allow(null),
  density: productFieldSchema.allow(null),
  dieSize: productFieldSchema.allow(null),
  directxVersion: productFieldSchema.allow(null),
  eccMemory: productFieldSchema.allow(null),
  eCores: productFieldSchema.allow(null),
  eCoreClock: productFieldSchema.allow(null),
  eCoreL1Cache: productFieldSchema.allow(null),
  eCoreL2Cache: productFieldSchema.allow(null),
  eCoreTurboClock: productFieldSchema.allow(null),
  extensionsTechnologies: productFieldSchema.allow(null),
  foundry: productFieldSchema.allow(null),
  fp16: productFieldSchema.allow(null),
  fp32: productFieldSchema.allow(null),
  fp64: productFieldSchema.allow(null),
  generation: productFieldSchema.allow(null),
  gpuCoreBaseClock: productFieldSchema.allow(null),
  gpuCoreBoostClock: productFieldSchema.allow(null),
  gpuCores: productFieldSchema.allow(null),
  height: productFieldSchema.allow(null),
  integratedGraphics: productFieldSchema.allow(null),
  l1Cache: productFieldSchema.allow(null),
  l2Cache: productFieldSchema.allow(null),
  l3Cache: productFieldSchema.allow(null),
  length: productFieldSchema.allow(null),
  marketSegment: productFieldSchema.allow(null),
  memoryBandwidth: productFieldSchema.allow(null),
  memoryChannels: productFieldSchema.allow(null),
  memoryClock: productFieldSchema.allow(null),
  memoryClockEffective: productFieldSchema.allow(null),
  memoryInterface: productFieldSchema.allow(null),
  memorySize: productFieldSchema.allow(null),
  memorySupport: productFieldSchema.allow(null),
  memoryType: productFieldSchema.allow(null),
  msrp: productFieldSchema.allow(null),
  multiplier: productFieldSchema.allow(null),
  multiplierUnlocked: productFieldSchema.allow(null),
  openClVersion: productFieldSchema.allow(null),
  openGlVersion: productFieldSchema.allow(null),
  outputs: productFieldSchema.allow(null),
  partNumber: productFieldSchema.allow(null),
  pciExpress: productFieldSchema.allow(null),
  pCores: productFieldSchema.allow(null),
  pCoreClock: productFieldSchema.allow(null),
  pCoreTurboClock: productFieldSchema.allow(null),
  pixelRate: productFieldSchema.allow(null),
  pixelShaders: productFieldSchema.allow(null),
  pl1: productFieldSchema.allow(null),
  pl2: productFieldSchema.allow(null),
  ppt: productFieldSchema.allow(null),
  powerConnectors: productFieldSchema.allow(null),
  predecessorGeneration: productFieldSchema.allow(null),
  processSize: productFieldSchema.allow(null),
  productionStatus: productFieldSchema.allow(null),
  releaseDate: productFieldSchema.allow(null),
  rops: productFieldSchema.allow(null),
  rtCores: productFieldSchema.allow(null),
  shaderClock: productFieldSchema.allow(null),
  shaderModelVersion: productFieldSchema.allow(null),
  slotWidth: productFieldSchema.allow(null),
  smp: productFieldSchema.allow(null),
  socket: productFieldSchema.allow(null),
  successorGeneration: productFieldSchema.allow(null),
  suggestedPsu: productFieldSchema.allow(null),
  tCaseMax: productFieldSchema.allow(null),
  tdp: productFieldSchema.allow(null),
  tensorCores: productFieldSchema.allow(null),
  textureRate: productFieldSchema.allow(null),
  threads: productFieldSchema.allow(null),
  tjMax: productFieldSchema.allow(null),
  tmus: productFieldSchema.allow(null),
  transistors: productFieldSchema.allow(null),
  turboClock: productFieldSchema.allow(null),
  vertexRate: productFieldSchema.allow(null),
  vertexShaders: productFieldSchema.allow(null),
  vulkanVersion: productFieldSchema.allow(null),
  weight: productFieldSchema.allow(null),
  width: productFieldSchema.allow(null),

  performanceRating: productFieldSchema.allow(null),
  performancePerMsrp: productFieldSchema.allow(null),

  metadata: Joi.any().allow(null),
});

export const productBenchmarkSchema = Joi.object({
  id: Joi.number().allow(null),
  productId: Joi.number().allow(null),

  benchmarkKey: Joi.string().valid(
    BenchmarKey.CpuMarkMultiThread,
    BenchmarKey.CpuMarkSingleThread,
    BenchmarKey.G2dMark,
    BenchmarKey.G3dMark,
    BenchmarKey.GeekBenchMultiCore,
    BenchmarKey.GeekBenchSingleCore,
    BenchmarKey.TimespyGraphics,
  ),
  value: Joi.number().allow(null),

  metadata: Joi.any().allow(null),
});

export const productSourceSchema = Joi.object({
  id: Joi.number().allow(null),
  productId: Joi.number().allow(null),

  sourceKey: Joi.string(),
  sourceUrl: Joi.string(),

  metadata: Joi.any().allow(null),

  scrapedAt: Joi.number().allow(null),

  sourceProductId: Joi.number().allow(null),
});

export const productImageSchema = Joi.object({
  imageId: Joi.number().required(),
  productId: Joi.number().allow(null),

  image: Joi.any().allow(null),
});

export const productSchema = Joi.object({
  id: Joi.number().allow(null),
  parentId: Joi.number().allow(null),

  productType: productTypeSchema.required().allow(null),
  slug: Joi.string().required(),
  name: Joi.string().required(),
  otherNames: Joi.array().items(Joi.string()).allow(null),
  company: Joi.string().allow(null),
  searchText: Joi.string().allow('').required(),
  affiliateUrl: Joi.string().allow('', null),

  metadata: Joi.any().allow(null),

  automatedAt: Joi.number().allow(null),

  fields: productFieldsSchema.allow(null),
  benchmarks: Joi.array().items(productBenchmarkSchema).allow(null),
  sources: Joi.array().items(productSourceSchema).allow(null),
  images: Joi.array().items(productImageSchema).allow(null),

  // Ignored
  relatedAutomationSources: Joi.any().allow(null),
  parent: Joi.any().allow(null),
  children: Joi.any().allow(null),
  updates: Joi.any().allow(null),
});

export const productUpdateSchema = Joi.object({
  id: Joi.number().allow(null),

  productType: productTypeSchema.required(),
  subProductType: subProductTypeSchema.allow(null),
  productName: Joi.string().required(),

  status: productUpdateStatusSchema.required(),
  description: Joi.string().allow(null),

  data: Joi.any().allow(null),
  metadata: Joi.any(),

  productId: Joi.number().allow(null),
}).options({
  abortEarly: false,
});

export const listProductsFilterSchema = Joi.object({
  chipsetId: Joi.array().items(Joi.number()).allow(null),
  company: Joi.array().items(Joi.string().allow('')).allow(null),
  excludeIds: Joi.array().items(Joi.number()).allow(null),
  isChipset: Joi.boolean().allow(null),
  isRetailModel: Joi.boolean().allow(null),
  maxPerformanceScore: Joi.number().allow(null),
  maxValueScore: Joi.number().allow(null),
  minPerformanceScore: Joi.number().allow(null),
  minValueScore: Joi.number().allow(null),
  performanceRated: Joi.boolean().allow(null),
  segment: Joi.array().items(marketSegmentSchema).allow(null),
  valueRated: Joi.boolean().allow(null),
  year: Joi.array().items(Joi.number()).allow(null),
});

export const listProductsRequestSchema = Joi.object({
  productType: productTypeSchema.required(),
  query: listQuerySchema({
    filterSchema: listProductsFilterSchema,
    maxLimit: 100,
  }),
}).options({ abortEarly: false });

export const listAllProductsRequestSchema = Joi.object({
  productType: productTypeSchema.required(),
  query: listQuerySchema({
    filterSchema: listProductsFilterSchema,
    maxLimit: Infinity,
  }),
}).options({ abortEarly: false });

export const createProductRequestSchema = Joi.object({
  product: productSchema,
}).options({
  abortEarly: false,
});

export const updateProductRequestSchema = Joi.object({
  product: productSchema,
}).options({
  abortEarly: false,
});

export const productAutocompleteQuerySchema = Joi.string().max(100);

export const autocompleteProductsRequestSchema = Joi.object({
  productType: productTypeSchema.required(),
  query: productAutocompleteQuerySchema.allow('', null),
}).options({
  abortEarly: false,
});

export const scrapeProductRequestSchema = Joi.object({
  productType: productTypeSchema.required(),
  sources: Joi.array().items(productSourceSchema).allow(null),
}).options({
  abortEarly: false,
});

export const listProductUpdatesRequestSchema = Joi.object({
  query: listQuerySchema({
    filterSchema: Joi.object({
      productType: productTypeSchema.required(),
      subProductType: subProductTypeSchema.allow(null),
      status: productUpdateStatusSchema.allow(null),
      search: Joi.string().allow('', null),
    }),
    maxLimit: 100,
  }),
}).options({
  abortEarly: false,
});

export const createProductUpdateRequestSchema = productUpdateSchema.options({
  abortEarly: false,
});

export const approveProductUpdateRequestSchema = Joi.object({
  slug: Joi.string().allow(null),
}).options({
  abortEarly: false,
});

export const rejectProductUpdateRequestSchema = Joi.object({}).options({
  abortEarly: false,
});
