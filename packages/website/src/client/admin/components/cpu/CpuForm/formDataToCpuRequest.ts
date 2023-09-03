import {
  CpuDataSourceKey,
  CreateCpuRequest,
  UpdateCpuRequest,
} from '@pcpartdb/shared';
import { CpuFormData } from './CpuFormData';

export function formDataToCpuRequest(
  formData: CpuFormData,
): CreateCpuRequest | UpdateCpuRequest {
  return {
    slug: formData.slug,
    name: formData.name,
    affiliateUrl: formData.affiliateUrl,

    // General Info
    partNumber: formData.partNumber || null,
    company: formData.company || null,
    marketSegments: formData.marketSegments || null,
    launchPrice: formData.launchPrice || null,
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
    hasEccMemory: formData.hasEccMemory || null,

    //
    coresCount: formData.coresCount || null,
    threadsCount: formData.threadsCount || null,
    performanceCoresCount: formData.performanceCoresCount || null,
    efficientCoresCount: formData.efficientCoresCount || null,
    clock: formData.clock || null,
    turboClock: formData.turboClock || null,
    performanceCoreClock: formData.performanceCoreClock || null,
    performanceCoreTurboClock: formData.performanceCoreTurboClock || null,
    efficientCoreClock: formData.efficientCoreClock || null,
    efficientCoreTurboClock: formData.efficientCoreTurboClock || null,
    baseClock: formData.baseClock || null,
    multiplier: formData.multiplier || null,
    isMultiplierUnlocked: formData.isMultiplierUnlocked || null,

    //
    tdp: formData.tdp || null,
    pl1: formData.pl1 || null,
    pl2: formData.pl2 || null,
    ppt: formData.ppt || null,

    //
    l1Cache: formData.l1Cache || null,
    l2Cache: formData.l2Cache || null,
    l3Cache: formData.l3Cache || null,
    efficientCoreL1Cache: formData.efficientCoreL1Cache || null,
    efficientCoreL2Cache: formData.efficientCoreL2Cache || null,

    // Graphics
    integratedGraphics: formData.integratedGraphics || null,

    // Features
    extensionsTechnologies: formData.extensionsTechnologies || null,

    // Benchmarks
    cpuMarkMultiThread: formData.cpuMarkMultiThread || null,
    cpuMarkSingleThread: formData.cpuMarkSingleThread || null,
    geekbenchSingleCore: formData.geekbenchSingleCore || null,
    geekbenchMultiCore: formData.geekbenchMultiCore || null,

    // Meta
    meta: {
      dataSources: {
        [CpuDataSourceKey.TechPowerUp]: formData.techPowerUpSource,
        [CpuDataSourceKey.PassMark]: formData.passMarkSource,
        [CpuDataSourceKey.GeekBench]: formData.geekBenchSource,
      },
    },

    images:
      formData.images
        ?.filter((image) => image != null)
        .map((image) => ({ imageId: image.imageId })) ?? [],
  };
}
