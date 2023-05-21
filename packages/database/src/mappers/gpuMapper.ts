import { Gpu, GpuDataSource, GpuMeta } from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { GpuEntity, GpuMetaJson } from '../gpu';
import { mapToGpuFieldDto, mapToGpuFieldEntity } from './gpuFieldMapper';
import { mapToGpuImageDtos, mapToGpuImageEntities } from './gpuImageMapper';

interface MapToDtoOptions {
  fields?: Set<string>;
  chipsetFields?: Set<string>;
  retailModelFields?: Set<string>;
  includeSources?: boolean;
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

    partNumber: mapToGpuFieldDto(entity, 'partNumber', options),
    company: mapToGpuFieldDto(entity, 'company', options),
    marketSegment: mapToGpuFieldDto(entity, 'marketSegment', options),
    launchPrice: mapToGpuFieldDto(entity, 'launchPrice', options),
    releaseDate: mapToGpuFieldDto(entity, 'releaseDate', options),
    productionStatus: mapToGpuFieldDto(entity, 'productionStatus', options),

    codename: mapToGpuFieldDto(entity, 'codename', options),
    architecture: mapToGpuFieldDto(entity, 'architecture', options),
    processSize: mapToGpuFieldDto(entity, 'processSize', options),
    transistors: mapToGpuFieldDto(entity, 'transistors', options),

    memorySize: mapToGpuFieldDto(entity, 'memorySize', options),
    memoryType: mapToGpuFieldDto(entity, 'memoryType', options),
    memoryClock: mapToGpuFieldDto(entity, 'memoryClock', options),
    memoryInterface: mapToGpuFieldDto(entity, 'memoryInterface', options),
    memoryBandwidth: mapToGpuFieldDto(entity, 'memoryBandwidth', options),

    slotWidth: mapToGpuFieldDto(entity, 'slotWidth', options),
    length: mapToGpuFieldDto(entity, 'length', options),
    width: mapToGpuFieldDto(entity, 'width', options),
    height: mapToGpuFieldDto(entity, 'height', options),
    weight: mapToGpuFieldDto(entity, 'weight', options),
    thermalDesignPower: mapToGpuFieldDto(entity, 'thermalDesignPower', options),
    suggestedPsu: mapToGpuFieldDto(entity, 'suggestedPsu', options),
    busInterface: mapToGpuFieldDto(entity, 'busInterface', options),
    powerConnectors: mapToGpuFieldDto(entity, 'powerConnectors', options),
    outputs: mapToGpuFieldDto(entity, 'outputs', options),

    shaderUnitsCudaCores: mapToGpuFieldDto(
      entity,
      'shaderUnitsCudaCores',
      options,
    ),
    computeUnitsSmCount: mapToGpuFieldDto(
      entity,
      'computeUnitsSmCount',
      options,
    ),
    textureMappingUnits: mapToGpuFieldDto(
      entity,
      'textureMappingUnits',
      options,
    ),
    renderOutputUnits: mapToGpuFieldDto(entity, 'renderOutputUnits', options),
    tensorCores: mapToGpuFieldDto(entity, 'tensorCores', options),
    rayTracingCores: mapToGpuFieldDto(entity, 'rayTracingCores', options),
    coreClockSpeedBase: mapToGpuFieldDto(entity, 'coreClockSpeedBase', options),
    coreClockSpeedBoost: mapToGpuFieldDto(
      entity,
      'coreClockSpeedBoost',
      options,
    ),
    l1Cache: mapToGpuFieldDto(entity, 'l1Cache', options),
    l2Cache: mapToGpuFieldDto(entity, 'l2Cache', options),

    pixelFillRate: mapToGpuFieldDto(entity, 'pixelFillRate', options),
    textureFillRate: mapToGpuFieldDto(entity, 'textureFillRate', options),
    fp32Performance: mapToGpuFieldDto(entity, 'fp32Performance', options),
    fp64Performance: mapToGpuFieldDto(entity, 'fp64Performance', options),

    directxVersion: mapToGpuFieldDto(entity, 'directxVersion', options),
    openClVersion: mapToGpuFieldDto(entity, 'openClVersion', options),
    openGlVersion: mapToGpuFieldDto(entity, 'openGlVersion', options),
    shaderModelVersion: mapToGpuFieldDto(entity, 'shaderModelVersion', options),

    g3dMark: mapToGpuFieldDto(entity, 'g3dMark', options),
    g2dMark: mapToGpuFieldDto(entity, 'g2dMark', options),
    timespyGraphics: mapToGpuFieldDto(entity, 'timespyGraphics', options),
    performanceScore: mapToGpuFieldDto(entity, 'performanceScore', options),
    valueScore: mapToGpuFieldDto(entity, 'valueScore', options),

    meta: mapToGpuMetaDto(entity.metadata as GpuMetaJson, options),
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
    partNumber: mapToGpuFieldEntity(gpu, 'partNumber', metadata),
    company: mapToGpuFieldEntity(gpu, 'company', metadata),
    marketSegment: mapToGpuFieldEntity(gpu, 'marketSegment', metadata),
    launchPrice: mapToGpuFieldEntity(gpu, 'launchPrice', metadata),
    releaseDate: mapToGpuFieldEntity(gpu, 'releaseDate', metadata),
    productionStatus: mapToGpuFieldEntity(gpu, 'productionStatus', metadata),

    codename: mapToGpuFieldEntity(gpu, 'codename', metadata),
    architecture: mapToGpuFieldEntity(gpu, 'architecture', metadata),
    processSize: mapToGpuFieldEntity(gpu, 'processSize', metadata),
    transistors: mapToGpuFieldEntity(gpu, 'transistors', metadata),

    memorySize: mapToGpuFieldEntity(gpu, 'memorySize', metadata),
    memoryType: mapToGpuFieldEntity(gpu, 'memoryType', metadata),
    memoryClock: mapToGpuFieldEntity(gpu, 'memoryClock', metadata),
    memoryInterface: mapToGpuFieldEntity(gpu, 'memoryInterface', metadata),
    memoryBandwidth: mapToGpuFieldEntity(gpu, 'memoryBandwidth', metadata),

    slotWidth: mapToGpuFieldEntity(gpu, 'slotWidth', metadata),
    length: mapToGpuFieldEntity(gpu, 'length', metadata),
    width: mapToGpuFieldEntity(gpu, 'width', metadata),
    height: mapToGpuFieldEntity(gpu, 'height', metadata),
    weight: mapToGpuFieldEntity(gpu, 'weight', metadata),
    thermalDesignPower: mapToGpuFieldEntity(
      gpu,
      'thermalDesignPower',
      metadata,
    ),
    suggestedPsu: mapToGpuFieldEntity(gpu, 'suggestedPsu', metadata),
    busInterface: mapToGpuFieldEntity(gpu, 'busInterface', metadata),
    powerConnectors: mapToGpuFieldEntity(gpu, 'powerConnectors', metadata),
    outputs: mapToGpuFieldEntity(gpu, 'outputs', metadata),

    shaderUnitsCudaCores: mapToGpuFieldEntity(
      gpu,
      'shaderUnitsCudaCores',
      metadata,
    ),
    computeUnitsSmCount: mapToGpuFieldEntity(
      gpu,
      'computeUnitsSmCount',
      metadata,
    ),
    textureMappingUnits: mapToGpuFieldEntity(
      gpu,
      'textureMappingUnits',
      metadata,
    ),
    renderOutputUnits: mapToGpuFieldEntity(gpu, 'renderOutputUnits', metadata),
    tensorCores: mapToGpuFieldEntity(gpu, 'tensorCores', metadata),
    rayTracingCores: mapToGpuFieldEntity(gpu, 'rayTracingCores', metadata),
    coreClockSpeedBase: mapToGpuFieldEntity(
      gpu,
      'coreClockSpeedBase',
      metadata,
    ),
    coreClockSpeedBoost: mapToGpuFieldEntity(
      gpu,
      'coreClockSpeedBoost',
      metadata,
    ),
    l1Cache: mapToGpuFieldEntity(gpu, 'l1Cache', metadata),
    l2Cache: mapToGpuFieldEntity(gpu, 'l2Cache', metadata),

    pixelFillRate: mapToGpuFieldEntity(gpu, 'pixelFillRate', metadata),
    textureFillRate: mapToGpuFieldEntity(gpu, 'textureFillRate', metadata),
    fp32Performance: mapToGpuFieldEntity(gpu, 'fp32Performance', metadata),
    fp64Performance: mapToGpuFieldEntity(gpu, 'fp64Performance', metadata),

    directxVersion: mapToGpuFieldEntity(gpu, 'directxVersion', metadata),
    openClVersion: mapToGpuFieldEntity(gpu, 'openClVersion', metadata),
    openGlVersion: mapToGpuFieldEntity(gpu, 'openGlVersion', metadata),
    shaderModelVersion: mapToGpuFieldEntity(
      gpu,
      'shaderModelVersion',
      metadata,
    ),

    performanceScore: mapToGpuFieldEntity(gpu, 'performanceScore', metadata),
    valueScore: mapToGpuFieldEntity(gpu, 'valueScore', metadata),
    g3dMark: mapToGpuFieldEntity(gpu, 'g3dMark', metadata),
    g2dMark: mapToGpuFieldEntity(gpu, 'g2dMark', metadata),
    timespyGraphics: mapToGpuFieldEntity(gpu, 'timespyGraphics', metadata),
  };

  return {
    ...mappedFields,

    id: undefined,
    chipsetId: gpu.chipsetId,

    slug: gpu.slug,
    name: gpu.name,
    affiliateUrl: gpu.affiliateUrl,

    metadata: metadata as Prisma.JsonObject,

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
