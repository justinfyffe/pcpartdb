import Joi from '@hapi/joi';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  Cpu,
  CpuDataSourceKey,
  cpuDataSourceValidator,
  cpuDataValidator,
  cpuImageValidator,
} from '@pcpartdb/shared';
import { UseFormProps } from 'react-hook-form';
import { CpuFormData } from './CpuFormData';

const cpuValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),
  affiliateUrl: Joi.string().allow(null),

  // Data Sources
  techPowerUpSource: cpuDataSourceValidator.allow(null),
  passMarkSource: cpuDataSourceValidator.allow(null),
  geekBenchSource: cpuDataSourceValidator.allow(null),

  // General Info
  partNumber: cpuDataValidator.allow(null),
  company: cpuDataValidator.allow(null),
  marketSegments: cpuDataValidator.allow(null),
  launchPrice: cpuDataValidator.allow(null),
  releaseDate: cpuDataValidator.allow(null),
  productionStatus: cpuDataValidator.allow(null),
  bundledCooler: cpuDataValidator.allow(null),

  // Physical
  socket: cpuDataValidator.allow(null),
  foundry: cpuDataValidator.allow(null),
  processSize: cpuDataValidator.allow(null),
  transistors: cpuDataValidator.allow(null),
  tCaseMax: cpuDataValidator.allow(null),
  tjMax: cpuDataValidator.allow(null),

  // Technical
  architecture: cpuDataValidator.allow(null),
  codename: cpuDataValidator.allow(null),
  generation: cpuDataValidator.allow(null),
  pciExpress: cpuDataValidator.allow(null),
  chipsets: cpuDataValidator.allow(null),

  // Memory
  memorySupport: cpuDataValidator.allow(null),
  memoryChannels: cpuDataValidator.allow(null),
  hasEccMemory: cpuDataValidator.allow(null),

  // Cores & Clock Speed
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

  // Power Consumption
  tdp: cpuDataValidator.allow(null),
  pl1: cpuDataValidator.allow(null),
  pl2: cpuDataValidator.allow(null),
  ppt: cpuDataValidator.allow(null),

  // Cache
  l1Cache: cpuDataValidator.allow(null),
  l2Cache: cpuDataValidator.allow(null),
  l3Cache: cpuDataValidator.allow(null),
  efficientCoreL1Cache: cpuDataValidator.allow(null),
  efficientCoreL2Cache: cpuDataValidator.allow(null),

  // Graphics
  integratedGraphics: cpuDataValidator.allow(null),

  // Features
  extensionsTechnologies: cpuDataValidator.allow(null),

  // Benchmarks
  performanceScore: cpuDataValidator.allow(null),
  valueScore: cpuDataValidator.allow(null),
  cpuMarkMultiThread: cpuDataValidator.allow(null),
  cpuMarkSingleThread: cpuDataValidator.allow(null),
  geekbenchSingleCore: cpuDataValidator.allow(null),
  geekbenchMultiCore: cpuDataValidator.allow(null),

  // Images
  images: Joi.array().allow(cpuImageValidator),
}).options({ abortEarly: false });

export function cpuFormOptions(cpu?: Cpu): UseFormProps<CpuFormData> {
  return {
    resolver: joiResolver(cpuValidator),
    mode: 'onBlur',
    defaultValues: {
      slug: cpu?.slug || null,
      name: cpu?.name || null,
      affiliateUrl: cpu?.affiliateUrl || null,

      // Data Sources
      techPowerUpSource:
        cpu?.meta?.dataSources?.[CpuDataSourceKey.TechPowerUp] || null,
      passMarkSource:
        cpu?.meta?.dataSources?.[CpuDataSourceKey.PassMark] || null,
      geekBenchSource:
        cpu?.meta?.dataSources?.[CpuDataSourceKey.GeekBench] || null,

      // General Info
      partNumber: cpu?.partNumber || null,
      company: cpu?.company || null,
      marketSegments: cpu?.marketSegments || null,
      launchPrice: cpu?.launchPrice || null,
      releaseDate: cpu?.releaseDate || null,
      productionStatus: cpu?.productionStatus || null,
      bundledCooler: cpu?.bundledCooler || null,

      // Physical Specs
      socket: cpu?.socket || null,
      foundry: cpu?.foundry || null,
      processSize: cpu?.processSize || null,
      transistors: cpu?.transistors || null,
      tCaseMax: cpu?.tCaseMax || null,
      tjMax: cpu?.tjMax || null,

      // Technical Specs
      architecture: cpu?.architecture || null,
      codename: cpu?.codename || null,
      generation: cpu?.generation || null,
      pciExpress: cpu?.pciExpress || null,
      chipsets: cpu?.chipsets || null,

      // Memory Specs
      memorySupport: cpu?.memorySupport || null,
      memoryChannels: cpu?.memoryChannels || null,
      hasEccMemory: cpu?.hasEccMemory || null,

      // Processing Specs
      coresCount: cpu?.coresCount || null,
      threadsCount: cpu?.threadsCount || null,
      performanceCoresCount: cpu?.performanceCoresCount || null,
      efficientCoresCount: cpu?.efficientCoresCount || null,

      // Clock Speed Specs
      clock: cpu?.clock || null,
      turboClock: cpu?.turboClock || null,
      performanceCoreClock: cpu?.performanceCoreClock || null,
      performanceCoreTurboClock: cpu?.performanceCoreTurboClock || null,
      efficientCoreClock: cpu?.efficientCoreClock || null,
      efficientCoreTurboClock: cpu?.efficientCoreTurboClock || null,
      baseClock: cpu?.baseClock || null,
      multiplier: cpu?.multiplier || null,
      isMultiplierUnlocked: cpu?.isMultiplierUnlocked || null,

      // Power Specs
      tdp: cpu?.tdp || null,
      pl1: cpu?.pl1 || null,
      pl2: cpu?.pl2 || null,
      ppt: cpu?.ppt || null,

      // Cache Specs
      l1Cache: cpu?.l1Cache || null,
      l2Cache: cpu?.l2Cache || null,
      l3Cache: cpu?.l3Cache || null,
      efficientCoreL1Cache: cpu?.efficientCoreL1Cache || null,
      efficientCoreL2Cache: cpu?.efficientCoreL2Cache || null,

      // Graphics & Features
      integratedGraphics: cpu?.integratedGraphics || null,
      extensionsTechnologies: cpu?.extensionsTechnologies || null,

      // Benchmarks
      performanceScore: cpu?.performanceScore || null,
      valueScore: cpu?.valueScore || null,
      cpuMarkMultiThread: cpu?.cpuMarkMultiThread || null,
      cpuMarkSingleThread: cpu?.cpuMarkSingleThread || null,
      geekbenchSingleCore: cpu?.geekbenchSingleCore || null,
      geekbenchMultiCore: cpu?.geekbenchMultiCore || null,

      // Images
      images: cpu?.images || [],
    },
  };
}
