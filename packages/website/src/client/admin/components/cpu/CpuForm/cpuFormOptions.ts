import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  CpuProduct,
  productBenchmarkSchema,
  productFieldSchema,
  productImageSchema,
  productSourceSchema,
} from '@pcpartdb/shared';
import { UseFormProps } from 'react-hook-form';
import { CpuFormData } from './CpuFormData';

const cpuFormSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  company: Joi.string(),
  otherNames: Joi.array().items(Joi.string()).allow(null),
  searchText: Joi.string().allow(null),
  affiliateUrl: Joi.string().allow(null),
  summary: Joi.string().allow(null),

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

export function cpuFormOptions(cpu?: CpuProduct): UseFormProps<CpuFormData> {
  const benchmarks = cpu?.benchmarks || [];
  const sources = cpu?.sources || [];
  const images = cpu?.images || [];

  return {
    resolver: joiResolver(cpuFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: cpu?.name ?? null,
      slug: cpu?.slug ?? null,
      company: cpu?.company ?? null,
      otherNames: cpu?.otherNames || [],
      searchText: cpu?.searchText ?? null,
      affiliateUrl: cpu?.affiliateUrl ?? null,

      // Data Sources
      sources,

      // General Info
      partNumber: cpu?.fields?.partNumber ?? null,
      marketSegment: cpu?.fields?.marketSegment ?? null,
      msrp: cpu?.fields?.msrp ?? null,
      releaseDate: cpu?.fields?.releaseDate ?? null,
      productionStatus: cpu?.fields?.productionStatus ?? null,
      bundledCooler: cpu?.fields?.bundledCooler ?? null,

      // Physical Specs
      socket: cpu?.fields?.socket ?? null,
      foundry: cpu?.fields?.foundry ?? null,
      processSize: cpu?.fields?.processSize ?? null,
      transistors: cpu?.fields?.transistors ?? null,
      tCaseMax: cpu?.fields?.tCaseMax ?? null,
      tjMax: cpu?.fields?.tjMax ?? null,

      // Technical Specs
      architecture: cpu?.fields?.architecture ?? null,
      codename: cpu?.fields?.codename ?? null,
      generation: cpu?.fields?.generation ?? null,
      pciExpress: cpu?.fields?.pciExpress ?? null,
      chipsets: cpu?.fields?.chipsets ?? null,

      // Memory Specs
      memorySupport: cpu?.fields?.memorySupport ?? null,
      memoryChannels: cpu?.fields?.memoryChannels ?? null,
      eccMemory: cpu?.fields?.eccMemory ?? null,

      // Processing Specs
      cores: cpu?.fields?.cores ?? null,
      threads: cpu?.fields?.threads ?? null,
      pCores: cpu?.fields?.pCores ?? null,
      eCores: cpu?.fields?.eCores ?? null,

      // Clock Speed Specs
      clock: cpu?.fields?.clock ?? null,
      turboClock: cpu?.fields?.turboClock ?? null,
      pCoreClock: cpu?.fields?.pCoreClock ?? null,
      pCoreTurboClock: cpu?.fields?.pCoreTurboClock ?? null,
      eCoreClock: cpu?.fields?.eCoreClock ?? null,
      eCoreTurboClock: cpu?.fields?.eCoreTurboClock ?? null,
      baseClock: cpu?.fields?.baseClock ?? null,
      multiplier: cpu?.fields?.multiplier ?? null,
      multiplierUnlocked: cpu?.fields?.multiplierUnlocked ?? null,

      // Power Specs
      tdp: cpu?.fields?.tdp ?? null,
      pl1: cpu?.fields?.pl1 ?? null,
      pl2: cpu?.fields?.pl2 ?? null,
      ppt: cpu?.fields?.ppt ?? null,

      // Cache Specs
      l1Cache: cpu?.fields?.l1Cache ?? null,
      l2Cache: cpu?.fields?.l2Cache ?? null,
      l3Cache: cpu?.fields?.l3Cache ?? null,
      eCoreL1Cache: cpu?.fields?.eCoreL1Cache ?? null,
      eCoreL2Cache: cpu?.fields?.eCoreL2Cache ?? null,

      // Graphics & Features
      integratedGraphics: cpu?.fields?.integratedGraphics ?? null,
      extensionsTechnologies: cpu?.fields?.extensionsTechnologies ?? null,

      // Benchmarks
      benchmarks,

      // Images
      images,
    },
  };
}
