import { Gpu, GpuDataSource, GpuMeta } from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { GpuEntity, GpuMetaJson } from '../gpu';
import { mapToGpuDataDto, mapToGpuDataEntity } from './gpuDataMapper';
import { mapToGpuImageDtos, mapToGpuImageEntities } from './gpuImageMapper';

interface MapToDtoOptions {
  fields?: Set<string>;
  chipsetFields?: Set<string>;
  retailModelFields?: Set<string>;
  includeSources?: boolean;
  includeAutomation?: boolean;
}

export function mapToGpuDto(entity: GpuEntity, options?: MapToDtoOptions): Gpu {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    chipsetId: entity.chipsetId,
    slug: entity.slug,

    name: entity.name,
    affiliateUrl: entity.affiliateUrl,

    partNumber: mapToGpuDataDto(entity, 'partNumber', options),
    company: mapToGpuDataDto(entity, 'company', options),
    marketSegment: mapToGpuDataDto(entity, 'marketSegment', options),
    launchPrice: mapToGpuDataDto(entity, 'launchPrice', options),
    releaseDate: mapToGpuDataDto(entity, 'releaseDate', options),
    productionStatus: mapToGpuDataDto(entity, 'productionStatus', options),

    codename: mapToGpuDataDto(entity, 'codename', options),
    architecture: mapToGpuDataDto(entity, 'architecture', options),
    processSize: mapToGpuDataDto(entity, 'processSize', options),
    transistors: mapToGpuDataDto(entity, 'transistors', options),

    memorySize: mapToGpuDataDto(entity, 'memorySize', options),
    memoryType: mapToGpuDataDto(entity, 'memoryType', options),
    memoryClock: mapToGpuDataDto(entity, 'memoryClock', options),
    memoryInterface: mapToGpuDataDto(entity, 'memoryInterface', options),
    memoryBandwidth: mapToGpuDataDto(entity, 'memoryBandwidth', options),

    slotWidth: mapToGpuDataDto(entity, 'slotWidth', options),
    length: mapToGpuDataDto(entity, 'length', options),
    width: mapToGpuDataDto(entity, 'width', options),
    height: mapToGpuDataDto(entity, 'height', options),
    weight: mapToGpuDataDto(entity, 'weight', options),
    thermalDesignPower: mapToGpuDataDto(entity, 'thermalDesignPower', options),
    suggestedPsu: mapToGpuDataDto(entity, 'suggestedPsu', options),
    busInterface: mapToGpuDataDto(entity, 'busInterface', options),
    powerConnectors: mapToGpuDataDto(entity, 'powerConnectors', options),
    outputs: mapToGpuDataDto(entity, 'outputs', options),

    shaderUnitsCudaCores: mapToGpuDataDto(
      entity,
      'shaderUnitsCudaCores',
      options,
    ),
    computeUnitsSmCount: mapToGpuDataDto(
      entity,
      'computeUnitsSmCount',
      options,
    ),
    textureMappingUnits: mapToGpuDataDto(
      entity,
      'textureMappingUnits',
      options,
    ),
    renderOutputUnits: mapToGpuDataDto(entity, 'renderOutputUnits', options),
    tensorCores: mapToGpuDataDto(entity, 'tensorCores', options),
    rayTracingCores: mapToGpuDataDto(entity, 'rayTracingCores', options),
    coreClockSpeedBase: mapToGpuDataDto(entity, 'coreClockSpeedBase', options),
    coreClockSpeedBoost: mapToGpuDataDto(
      entity,
      'coreClockSpeedBoost',
      options,
    ),
    l1Cache: mapToGpuDataDto(entity, 'l1Cache', options),
    l2Cache: mapToGpuDataDto(entity, 'l2Cache', options),

    pixelFillRate: mapToGpuDataDto(entity, 'pixelFillRate', options),
    textureFillRate: mapToGpuDataDto(entity, 'textureFillRate', options),
    fp32Performance: mapToGpuDataDto(entity, 'fp32Performance', options),
    fp64Performance: mapToGpuDataDto(entity, 'fp64Performance', options),

    directxVersion: mapToGpuDataDto(entity, 'directxVersion', options),
    openClVersion: mapToGpuDataDto(entity, 'openClVersion', options),
    openGlVersion: mapToGpuDataDto(entity, 'openGlVersion', options),
    shaderModelVersion: mapToGpuDataDto(entity, 'shaderModelVersion', options),

    g3dMark: mapToGpuDataDto(entity, 'g3dMark', options),
    g2dMark: mapToGpuDataDto(entity, 'g2dMark', options),
    timespyGraphics: mapToGpuDataDto(entity, 'timespyGraphics', options),
    performanceScore: mapToGpuDataDto(entity, 'performanceScore', options),
    valueScore: mapToGpuDataDto(entity, 'valueScore', options),

    meta: mapToGpuMetaDto(entity.metadata as GpuMetaJson, options),
    automationTimestamp: options.includeAutomation
      ? entity.automationTimestamp?.getTime()
      : undefined,
    updatedAt:
      entity.updatedAt != null ? entity.updatedAt.getTime() : undefined,

    images: mapToGpuImageDtos(entity.images),
    chipset: mapToGpuDto(entity.chipset, {
      ...options,
      fields: options?.chipsetFields,
    }),
    retailModels: mapToGpuDtos(entity.retailModels, {
      ...options,
      fields: options?.retailModelFields,
    }),
  };
}

export function mapToGpuDtos(
  entities: GpuEntity[],
  options?: MapToDtoOptions,
): Gpu[] {
  return entities?.map((entity) => mapToGpuDto(entity, options)) || [];
}

function mapToGpuMetaDto(metaJson: GpuMetaJson, options?: MapToDtoOptions) {
  let dataSources = {};

  // Don't include sources unless explicitly specified
  if (options?.includeSources) {
    dataSources = Object.keys(metaJson?.dataSources ?? {}).reduce(
      (acc, key) => {
        acc[key] = metaJson.dataSources[key];
        return acc;
      },
      {} as Record<string, GpuDataSource>,
    );
  }

  return { dataSources } as GpuMeta;
}

export function mapToGpuEntity(gpu: Partial<Gpu>): GpuEntity {
  if (gpu == null) {
    return null;
  }

  const metadata = mapToGpuMetaEntity(gpu.meta);

  const mappedFields: Partial<GpuEntity> = {
    partNumber: mapToGpuDataEntity(gpu, 'partNumber', metadata),
    company: mapToGpuDataEntity(gpu, 'company', metadata),
    marketSegment: mapToGpuDataEntity(gpu, 'marketSegment', metadata),
    launchPrice: mapToGpuDataEntity(gpu, 'launchPrice', metadata),
    releaseDate: mapToGpuDataEntity(gpu, 'releaseDate', metadata),
    productionStatus: mapToGpuDataEntity(gpu, 'productionStatus', metadata),

    codename: mapToGpuDataEntity(gpu, 'codename', metadata),
    architecture: mapToGpuDataEntity(gpu, 'architecture', metadata),
    processSize: mapToGpuDataEntity(gpu, 'processSize', metadata),
    transistors: mapToGpuDataEntity(gpu, 'transistors', metadata),

    memorySize: mapToGpuDataEntity(gpu, 'memorySize', metadata),
    memoryType: mapToGpuDataEntity(gpu, 'memoryType', metadata),
    memoryClock: mapToGpuDataEntity(gpu, 'memoryClock', metadata),
    memoryInterface: mapToGpuDataEntity(gpu, 'memoryInterface', metadata),
    memoryBandwidth: mapToGpuDataEntity(gpu, 'memoryBandwidth', metadata),

    slotWidth: mapToGpuDataEntity(gpu, 'slotWidth', metadata),
    length: mapToGpuDataEntity(gpu, 'length', metadata),
    width: mapToGpuDataEntity(gpu, 'width', metadata),
    height: mapToGpuDataEntity(gpu, 'height', metadata),
    weight: mapToGpuDataEntity(gpu, 'weight', metadata),
    thermalDesignPower: mapToGpuDataEntity(gpu, 'thermalDesignPower', metadata),
    suggestedPsu: mapToGpuDataEntity(gpu, 'suggestedPsu', metadata),
    busInterface: mapToGpuDataEntity(gpu, 'busInterface', metadata),
    powerConnectors: mapToGpuDataEntity(gpu, 'powerConnectors', metadata),
    outputs: mapToGpuDataEntity(gpu, 'outputs', metadata),

    shaderUnitsCudaCores: mapToGpuDataEntity(
      gpu,
      'shaderUnitsCudaCores',
      metadata,
    ),
    computeUnitsSmCount: mapToGpuDataEntity(
      gpu,
      'computeUnitsSmCount',
      metadata,
    ),
    textureMappingUnits: mapToGpuDataEntity(
      gpu,
      'textureMappingUnits',
      metadata,
    ),
    renderOutputUnits: mapToGpuDataEntity(gpu, 'renderOutputUnits', metadata),
    tensorCores: mapToGpuDataEntity(gpu, 'tensorCores', metadata),
    rayTracingCores: mapToGpuDataEntity(gpu, 'rayTracingCores', metadata),
    coreClockSpeedBase: mapToGpuDataEntity(gpu, 'coreClockSpeedBase', metadata),
    coreClockSpeedBoost: mapToGpuDataEntity(
      gpu,
      'coreClockSpeedBoost',
      metadata,
    ),
    l1Cache: mapToGpuDataEntity(gpu, 'l1Cache', metadata),
    l2Cache: mapToGpuDataEntity(gpu, 'l2Cache', metadata),

    pixelFillRate: mapToGpuDataEntity(gpu, 'pixelFillRate', metadata),
    textureFillRate: mapToGpuDataEntity(gpu, 'textureFillRate', metadata),
    fp32Performance: mapToGpuDataEntity(gpu, 'fp32Performance', metadata),
    fp64Performance: mapToGpuDataEntity(gpu, 'fp64Performance', metadata),

    directxVersion: mapToGpuDataEntity(gpu, 'directxVersion', metadata),
    openClVersion: mapToGpuDataEntity(gpu, 'openClVersion', metadata),
    openGlVersion: mapToGpuDataEntity(gpu, 'openGlVersion', metadata),
    shaderModelVersion: mapToGpuDataEntity(gpu, 'shaderModelVersion', metadata),

    performanceScore: mapToGpuDataEntity(gpu, 'performanceScore', metadata),
    valueScore: mapToGpuDataEntity(gpu, 'valueScore', metadata),
    g3dMark: mapToGpuDataEntity(gpu, 'g3dMark', metadata),
    g2dMark: mapToGpuDataEntity(gpu, 'g2dMark', metadata),
    timespyGraphics: mapToGpuDataEntity(gpu, 'timespyGraphics', metadata),
  };

  let automationTimestamp: Date = undefined;
  if (gpu.automationTimestamp != null) {
    automationTimestamp = new Date(gpu.automationTimestamp);
  }

  return {
    ...mappedFields,

    id: undefined,
    chipsetId: gpu.chipsetId,

    slug: gpu.slug,
    name: gpu.name,
    affiliateUrl: gpu.affiliateUrl,

    metadata: metadata as Prisma.JsonObject,
    automationTimestamp,

    images: mapToGpuImageEntities(gpu.images),
  } as GpuEntity;
}

function mapToGpuMetaEntity(meta: GpuMeta) {
  if (meta == null) {
    return {};
  }

  const dataSources = Object.keys(meta.dataSources ?? {}).reduce((acc, key) => {
    acc[key] = meta.dataSources[key];
    return acc;
  }, {} as Record<string, GpuDataSource>);

  return { dataSources, fields: {} } as GpuMetaJson;
}
