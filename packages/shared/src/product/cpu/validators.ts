import Joi from '@hapi/joi';

export const cpuDataValidator = Joi.object({
  value: Joi.any().allow(null),
  meta: Joi.any().allow(null),
}).options({ abortEarly: false });

export const cpuImageValidator = Joi.object({
  id: Joi.number().allow(null),
}).options({ abortEarly: false });

export const cpuDataSourceValidator = Joi.object({
  url: Joi.string().allow(null),
  downloadDate: Joi.number().allow(null),
}).options({ abortEarly: false });

export const cpuMetaValidator = Joi.object({
  dataSources: Joi.object()
    .pattern(/.*/, cpuDataSourceValidator.allow(null))
    .allow(null),
}).options({ abortEarly: false });

export const cpuValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),

  partNumber: cpuDataValidator.allow(null),
  company: cpuDataValidator.allow(null),
  marketSegments: cpuDataValidator.allow(null),
  launchPrice: cpuDataValidator.allow(null),
  releaseDate: cpuDataValidator.allow(null),
  productionStatus: cpuDataValidator.allow(null),
  bundledCooler: cpuDataValidator.allow(null),

  socket: cpuDataValidator.allow(null),
  foundry: cpuDataValidator.allow(null),
  processSize: cpuDataValidator.allow(null),
  transistors: cpuDataValidator.allow(null),
  tCaseMax: cpuDataValidator.allow(null),
  tjMax: cpuDataValidator.allow(null),

  architecture: cpuDataValidator.allow(null),
  codename: cpuDataValidator.allow(null),
  generation: cpuDataValidator.allow(null),
  pciExpress: cpuDataValidator.allow(null),
  chipsets: cpuDataValidator.allow(null),

  memorySupport: cpuDataValidator.allow(null),
  memoryChannels: cpuDataValidator.allow(null),
  hasEccMemory: cpuDataValidator.allow(null),

  coresCount: cpuDataValidator.allow(null),
  threadsCount: cpuDataValidator.allow(null),
  performanceCoresCount: cpuDataValidator.allow(null),
  efficientCoresCount: cpuDataValidator.allow(null),
  clock: cpuDataValidator.allow(null),
  turboClock: cpuDataValidator.allow(null),
  performanceCoreClock: cpuDataValidator.allow(null),
  performanceCoreTurboClock: cpuDataValidator.allow(null),
  efficientCoreClock: cpuDataValidator.allow(null),
  efficientCoreTurboClock: cpuDataValidator.allow(null),
  baseClock: cpuDataValidator.allow(null),
  multiplier: cpuDataValidator.allow(null),
  isMultiplierUnlocked: cpuDataValidator.allow(null),

  tdp: cpuDataValidator.allow(null),
  pl1: cpuDataValidator.allow(null),
  pl2: cpuDataValidator.allow(null),
  ppt: cpuDataValidator.allow(null),

  l1Cache: cpuDataValidator.allow(null),
  l2Cache: cpuDataValidator.allow(null),
  l3Cache: cpuDataValidator.allow(null),
  efficientCoreL1Cache: cpuDataValidator.allow(null),
  efficientCoreL2Cache: cpuDataValidator.allow(null),

  integratedGraphics: cpuDataValidator.allow(null),

  extensionsTechnologies: cpuDataValidator.allow(null),

  performanceScore: cpuDataValidator.allow(null),
  valueScore: cpuDataValidator.allow(null),
  cpuMarkMultiThread: cpuDataValidator.allow(null),
  cpuMarkSingleThread: cpuDataValidator.allow(null),
  geekbenchSingleCore: cpuDataValidator.allow(null),
  geekbenchMultiCore: cpuDataValidator.allow(null),

  images: Joi.array().allow(Joi.any()),
  meta: cpuMetaValidator.allow(null),
}).options({ abortEarly: false });
