import Joi from '@hapi/joi';

export const gpuDataValidator = Joi.object({
  value: Joi.any().allow(null),
  meta: Joi.any().allow(null),
}).options({ abortEarly: false });

export const gpuImageValidator = Joi.object({
  id: Joi.number().allow(null),
}).options({ abortEarly: false });

export const gpuDataSourceValidator = Joi.object({
  url: Joi.string().allow(null),
  downloadDate: Joi.number().allow(null),
}).options({ abortEarly: false });

export const gpuMetaValidator = Joi.object({
  dataSources: Joi.object()
    .pattern(/.*/, gpuDataSourceValidator.allow(null))
    .allow(null),
}).options({ abortEarly: false });

export const gpuValidator = Joi.object({
  id: Joi.number().allow(null),

  chipsetId: Joi.number().allow(null),
  slug: Joi.string().required(),
  name: Joi.string().required(),
  affiliateUrl: Joi.string().allow(null),

  partNumber: gpuDataValidator.allow(null),
  company: gpuDataValidator.allow(null),
  marketSegment: gpuDataValidator.allow(null),
  launchPrice: gpuDataValidator.allow(null),
  releaseDate: gpuDataValidator.allow(null),
  productionStatus: gpuDataValidator.allow(null),

  // Processor
  codename: gpuDataValidator.allow(null),
  architecture: gpuDataValidator.allow(null),
  processSize: gpuDataValidator.allow(null),
  transistors: gpuDataValidator.allow(null),

  // Memory
  memorySize: gpuDataValidator.allow(null),
  memoryType: gpuDataValidator.allow(null),
  memoryClock: gpuDataValidator.allow(null),
  memoryInterface: gpuDataValidator.allow(null),
  memoryBandwidth: gpuDataValidator.allow(null),

  // Board Design
  slotWidth: gpuDataValidator.allow(null),
  length: gpuDataValidator.allow(null),
  width: gpuDataValidator.allow(null),
  height: gpuDataValidator.allow(null),
  weight: gpuDataValidator.allow(null),
  thermalDesignPower: gpuDataValidator.allow(null),
  suggestedPsu: gpuDataValidator.allow(null),
  busInterface: gpuDataValidator.allow(null),
  powerConnectors: gpuDataValidator.allow(null),
  outputs: gpuDataValidator.allow(null),

  // Cores & Clock Speeds
  shaderUnitsCudaCores: gpuDataValidator.allow(null),
  computeUnitsSmCount: gpuDataValidator.allow(null),
  textureMappingUnits: gpuDataValidator.allow(null),
  renderOutputUnits: gpuDataValidator.allow(null),
  tensorCores: gpuDataValidator.allow(null),
  rayTracingCores: gpuDataValidator.allow(null),
  coreClockSpeedBase: gpuDataValidator.allow(null),
  coreClockSpeedBoost: gpuDataValidator.allow(null),
  l1Cache: gpuDataValidator.allow(null),
  l2Cache: gpuDataValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: gpuDataValidator.allow(null),
  textureFillRate: gpuDataValidator.allow(null),
  fp32Performance: gpuDataValidator.allow(null),
  fp64Performance: gpuDataValidator.allow(null),

  // API Support
  directxVersion: gpuDataValidator.allow(null),
  openClVersion: gpuDataValidator.allow(null),
  openGlVersion: gpuDataValidator.allow(null),
  shaderModelVersion: gpuDataValidator.allow(null),

  performanceScore: gpuDataValidator.allow(null),
  valueScore: gpuDataValidator.allow(null),
  g3dMark: gpuDataValidator.allow(null),
  g2dMark: gpuDataValidator.allow(null),
  timespyGraphics: gpuDataValidator.allow(null),

  images: Joi.array().allow(Joi.any()),
  meta: gpuMetaValidator.allow(null),

  updatedAt: Joi.date().allow(null),
}).options({ abortEarly: false });
