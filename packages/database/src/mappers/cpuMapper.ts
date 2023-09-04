import { Cpu, CpuDataSource, CpuMeta } from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { CpuEntity, CpuMetaJson } from '../cpu';
import { mapToCpuDataDto, mapToCpuDataEntity } from './cpuDataMapper';
import { mapToCpuImageDtos, mapToCpuImageEntities } from './cpuImageMapper';

interface MapToDtoOptions {
  fields?: Set<string>;
  includeSources?: boolean;
  includeAutomation?: boolean;
}

export function mapToCpuDto(entity: CpuEntity, options?: MapToDtoOptions): Cpu {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    slug: entity.slug,

    name: entity.name,
    affiliateUrl: entity.affiliateUrl,

    partNumber: mapToCpuDataDto(entity, 'partNumber', options),
    company: mapToCpuDataDto(entity, 'company', options),
    marketSegment: mapToCpuDataDto(entity, 'marketSegment', options),
    marketSegments: mapToCpuDataDto(entity, 'marketSegments', options), // TODO: delete
    launchPrice: mapToCpuDataDto(entity, 'launchPrice', options),
    releaseDate: mapToCpuDataDto(entity, 'releaseDate', options),
    productionStatus: mapToCpuDataDto(entity, 'productionStatus', options),
    bundledCooler: mapToCpuDataDto(entity, 'bundledCooler', options),

    socket: mapToCpuDataDto(entity, 'socket', options),
    foundry: mapToCpuDataDto(entity, 'foundry', options),
    processSize: mapToCpuDataDto(entity, 'processSize', options),
    transistors: mapToCpuDataDto(entity, 'transistors', options),
    tCaseMax: mapToCpuDataDto(entity, 'tCaseMax', options),
    tjMax: mapToCpuDataDto(entity, 'tjMax', options),

    architecture: mapToCpuDataDto(entity, 'architecture', options),
    codename: mapToCpuDataDto(entity, 'codename', options),
    generation: mapToCpuDataDto(entity, 'generation', options),
    pciExpress: mapToCpuDataDto(entity, 'pciExpress', options),
    chipsets: mapToCpuDataDto(entity, 'chipsets', options),

    memorySupport: mapToCpuDataDto(entity, 'memorySupport', options),
    memoryChannels: mapToCpuDataDto(entity, 'memoryChannels', options),
    hasEccMemory: mapToCpuDataDto(entity, 'hasEccMemory', options),

    coresCount: mapToCpuDataDto(entity, 'coresCount', options),
    threadsCount: mapToCpuDataDto(entity, 'threadsCount', options),
    performanceCoresCount: mapToCpuDataDto(
      entity,
      'performanceCoresCount',
      options,
    ),
    efficientCoresCount: mapToCpuDataDto(
      entity,
      'efficientCoresCount',
      options,
    ),
    clock: mapToCpuDataDto(entity, 'clock', options),
    turboClock: mapToCpuDataDto(entity, 'turboClock', options),
    performanceCoreClock: mapToCpuDataDto(
      entity,
      'performanceCoreClock',
      options,
    ),
    performanceCoreTurboClock: mapToCpuDataDto(
      entity,
      'performanceCoreTurboClock',
      options,
    ),
    efficientCoreClock: mapToCpuDataDto(entity, 'efficientCoreClock', options),
    efficientCoreTurboClock: mapToCpuDataDto(
      entity,
      'efficientCoreTurboClock',
      options,
    ),
    baseClock: mapToCpuDataDto(entity, 'baseClock', options),
    multiplier: mapToCpuDataDto(entity, 'multiplier', options),
    isMultiplierUnlocked: mapToCpuDataDto(
      entity,
      'isMultiplierUnlocked',
      options,
    ),

    tdp: mapToCpuDataDto(entity, 'tdp', options),
    pl1: mapToCpuDataDto(entity, 'pl1', options),
    pl2: mapToCpuDataDto(entity, 'pl2', options),
    ppt: mapToCpuDataDto(entity, 'ppt', options),

    l1Cache: mapToCpuDataDto(entity, 'l1Cache', options),
    l2Cache: mapToCpuDataDto(entity, 'l2Cache', options),
    l3Cache: mapToCpuDataDto(entity, 'l3Cache', options),
    efficientCoreL1Cache: mapToCpuDataDto(
      entity,
      'efficientCoreL1Cache',
      options,
    ),
    efficientCoreL2Cache: mapToCpuDataDto(
      entity,
      'efficientCoreL2Cache',
      options,
    ),

    integratedGraphics: mapToCpuDataDto(entity, 'integratedGraphics', options),

    extensionsTechnologies: mapToCpuDataDto(
      entity,
      'extensionsTechnologies',
      options,
    ),

    performanceScore: mapToCpuDataDto(entity, 'performanceScore', options),
    valueScore: mapToCpuDataDto(entity, 'valueScore', options),
    cpuMarkMultiThread: mapToCpuDataDto(entity, 'cpuMarkMultiThread', options),
    cpuMarkSingleThread: mapToCpuDataDto(
      entity,
      'cpuMarkSingleThread',
      options,
    ),
    geekbenchSingleCore: mapToCpuDataDto(
      entity,
      'geekbenchSingleCore',
      options,
    ),
    geekbenchMultiCore: mapToCpuDataDto(entity, 'geekbenchMultiCore', options),

    meta: mapToCpuMetaDto(entity.metadata as CpuMetaJson, options),
    automationTimestamp: options?.includeAutomation
      ? entity.automationTimestamp?.getTime()
      : undefined,
    updatedAt:
      entity.updatedAt != null ? entity.updatedAt.getTime() : undefined,

    images: mapToCpuImageDtos(entity.images),
  };
}

export function mapToCpuDtos(
  entities: CpuEntity[],
  options?: MapToDtoOptions,
): Cpu[] {
  return entities?.map((entity) => mapToCpuDto(entity, options)) || [];
}

function mapToCpuMetaDto(metaJson: CpuMetaJson, options?: MapToDtoOptions) {
  let dataSources = {};

  // Don't include sources unless explicitly specified
  if (options?.includeSources) {
    dataSources = Object.keys(metaJson?.dataSources ?? {}).reduce(
      (acc, key) => {
        acc[key] = metaJson.dataSources[key];
        return acc;
      },
      {} as Record<string, CpuDataSource>,
    );
  }

  return { dataSources } as CpuMeta;
}

export function mapToCpuEntity(cpu: Partial<Cpu>): CpuEntity {
  if (cpu == null) {
    return null;
  }

  const metadata = mapToCpuMetaEntity(cpu.meta);

  const mappedFields: Partial<CpuEntity> = {
    partNumber: mapToCpuDataEntity(cpu, 'partNumber', metadata),
    company: mapToCpuDataEntity(cpu, 'company', metadata),
    marketSegment: mapToCpuDataEntity(cpu, 'marketSegment', metadata),
    marketSegments: mapToCpuDataEntity(cpu, 'marketSegments', metadata) || [], // TODO: delete
    launchPrice: mapToCpuDataEntity(cpu, 'launchPrice', metadata),
    releaseDate: mapToCpuDataEntity(cpu, 'releaseDate', metadata),
    productionStatus: mapToCpuDataEntity(cpu, 'productionStatus', metadata),
    bundledCooler: mapToCpuDataEntity(cpu, 'bundledCooler', metadata),

    socket: mapToCpuDataEntity(cpu, 'socket', metadata),
    foundry: mapToCpuDataEntity(cpu, 'foundry', metadata),
    processSize: mapToCpuDataEntity(cpu, 'processSize', metadata),
    transistors: mapToCpuDataEntity(cpu, 'transistors', metadata),
    tCaseMax: mapToCpuDataEntity(cpu, 'tCaseMax', metadata),
    tjMax: mapToCpuDataEntity(cpu, 'tjMax', metadata),

    architecture: mapToCpuDataEntity(cpu, 'architecture', metadata),
    codename: mapToCpuDataEntity(cpu, 'codename', metadata),
    generation: mapToCpuDataEntity(cpu, 'generation', metadata),
    pciExpress: mapToCpuDataEntity(cpu, 'pciExpress', metadata) || [],
    chipsets: mapToCpuDataEntity(cpu, 'chipsets', metadata) || [],

    memorySupport: mapToCpuDataEntity(cpu, 'memorySupport', metadata) || [],
    memoryChannels: mapToCpuDataEntity(cpu, 'memoryChannels', metadata),
    hasEccMemory: mapToCpuDataEntity(cpu, 'hasEccMemory', metadata),

    coresCount: mapToCpuDataEntity(cpu, 'coresCount', metadata),
    threadsCount: mapToCpuDataEntity(cpu, 'threadsCount', metadata),
    performanceCoresCount: mapToCpuDataEntity(
      cpu,
      'performanceCoresCount',
      metadata,
    ),
    efficientCoresCount: mapToCpuDataEntity(
      cpu,
      'efficientCoresCount',
      metadata,
    ),
    clock: mapToCpuDataEntity(cpu, 'clock', metadata),
    turboClock: mapToCpuDataEntity(cpu, 'turboClock', metadata),
    performanceCoreClock: mapToCpuDataEntity(
      cpu,
      'performanceCoreClock',
      metadata,
    ),
    performanceCoreTurboClock: mapToCpuDataEntity(
      cpu,
      'performanceCoreTurboClock',
      metadata,
    ),
    efficientCoreClock: mapToCpuDataEntity(cpu, 'efficientCoreClock', metadata),
    efficientCoreTurboClock: mapToCpuDataEntity(
      cpu,
      'efficientCoreTurboClock',
      metadata,
    ),
    baseClock: mapToCpuDataEntity(cpu, 'baseClock', metadata),
    multiplier: mapToCpuDataEntity(cpu, 'multiplier', metadata),
    isMultiplierUnlocked: mapToCpuDataEntity(
      cpu,
      'isMultiplierUnlocked',
      metadata,
    ),

    tdp: mapToCpuDataEntity(cpu, 'tdp', metadata),
    pl1: mapToCpuDataEntity(cpu, 'pl1', metadata),
    pl2: mapToCpuDataEntity(cpu, 'pl2', metadata),
    ppt: mapToCpuDataEntity(cpu, 'ppt', metadata),

    l1Cache: mapToCpuDataEntity(cpu, 'l1Cache', metadata),
    l2Cache: mapToCpuDataEntity(cpu, 'l2Cache', metadata),
    l3Cache: mapToCpuDataEntity(cpu, 'l3Cache', metadata),
    efficientCoreL1Cache: mapToCpuDataEntity(
      cpu,
      'efficientCoreL1Cache',
      metadata,
    ),
    efficientCoreL2Cache: mapToCpuDataEntity(
      cpu,
      'efficientCoreL2Cache',
      metadata,
    ),

    integratedGraphics: mapToCpuDataEntity(cpu, 'integratedGraphics', metadata),

    extensionsTechnologies:
      mapToCpuDataEntity(cpu, 'extensionsTechnologies', metadata) || [],

    performanceScore: mapToCpuDataEntity(cpu, 'performanceScore', metadata),
    valueScore: mapToCpuDataEntity(cpu, 'valueScore', metadata),
    cpuMarkMultiThread: mapToCpuDataEntity(cpu, 'cpuMarkMultiThread', metadata),
    cpuMarkSingleThread: mapToCpuDataEntity(
      cpu,
      'cpuMarkSingleThread',
      metadata,
    ),
    geekbenchSingleCore: mapToCpuDataEntity(
      cpu,
      'geekbenchSingleCore',
      metadata,
    ),
    geekbenchMultiCore: mapToCpuDataEntity(cpu, 'geekbenchMultiCore', metadata),
  };

  let automationTimestamp: Date = undefined;
  if (cpu.automationTimestamp != null) {
    automationTimestamp = new Date(cpu.automationTimestamp);
  }

  return {
    ...mappedFields,

    id: undefined,

    slug: cpu.slug,
    name: cpu.name,
    affiliateUrl: cpu.affiliateUrl,

    metadata: metadata as Prisma.JsonObject,
    automationTimestamp,

    images: mapToCpuImageEntities(cpu.images),
  } as CpuEntity;
}

function mapToCpuMetaEntity(meta: CpuMeta) {
  if (meta == null) {
    return {};
  }

  const dataSources = Object.keys(meta.dataSources ?? {}).reduce((acc, key) => {
    acc[key] = meta.dataSources[key];
    return acc;
  }, {} as Record<string, CpuDataSource>);

  return { dataSources, fields: {} } as CpuMetaJson;
}
