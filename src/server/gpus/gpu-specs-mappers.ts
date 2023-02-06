import * as db from '@prisma/client';
import { Prisma } from '@prisma/client';
import { GpuSpec, GpuSpecMeta, GpuSpecs } from '@shared/gpus';

export function mapToGpuSpecsDto(entity: db.GpuSpecs): GpuSpecs {
  if (entity == null) {
    return null;
  }

  return {
    gpuId: entity.gpuId,

    company: mapToGpuSpecDto(entity, 'company'),
    marketSegment: mapToGpuSpecDto(entity, 'marketSegment'),
    launchPrice: mapToGpuSpecDto(entity, 'launchPrice'),
    releaseDate: mapToGpuSpecDto(entity, 'releaseDate'),

    codename: mapToGpuSpecDto(entity, 'codename'),
    architecture: mapToGpuSpecDto(entity, 'architecture'),
    processSize: mapToGpuSpecDto(entity, 'processSize'),
    transistors: mapToGpuSpecDto(entity, 'transistors'),

    memorySize: mapToGpuSpecDto(entity, 'memorySize'),
    memoryType: mapToGpuSpecDto(entity, 'memoryType'),
    memoryClock: mapToGpuSpecDto(entity, 'memoryClock'),
    memoryInterface: mapToGpuSpecDto(entity, 'memoryInterface'),
    memoryBandwidth: mapToGpuSpecDto(entity, 'memoryBandwidth'),

    slotWidth: mapToGpuSpecDto(entity, 'slotWidth'),
    length: mapToGpuSpecDto(entity, 'length'),
    width: mapToGpuSpecDto(entity, 'width'),
    height: mapToGpuSpecDto(entity, 'height'),
    weight: mapToGpuSpecDto(entity, 'weight'),
    thermalDesignPower: mapToGpuSpecDto(entity, 'thermalDesignPower'),
    suggestedPsu: mapToGpuSpecDto(entity, 'suggestedPsu'),
    busInterface: mapToGpuSpecDto(entity, 'busInterface'),
    powerConnectors: mapToGpuSpecDto(entity, 'powerConnectors'),
    outputs: mapToGpuSpecDto(entity, 'outputs'),

    shaderUnitsCudaCores: mapToGpuSpecDto(entity, 'shaderUnitsCudaCores'),
    textureMappingUnits: mapToGpuSpecDto(entity, 'textureMappingUnits'),
    renderOutputUnits: mapToGpuSpecDto(entity, 'renderOutputUnits'),
    tensorCores: mapToGpuSpecDto(entity, 'tensorCores'),
    rayTracingCores: mapToGpuSpecDto(entity, 'rayTracingCores'),
    coreClockSpeedBase: mapToGpuSpecDto(entity, 'coreClockSpeedBase'),
    coreClockSpeedBoost: mapToGpuSpecDto(entity, 'coreClockSpeedBoost'),
    l1Cache: mapToGpuSpecDto(entity, 'l1Cache'),
    l2Cache: mapToGpuSpecDto(entity, 'l2Cache'),

    pixelFillRate: mapToGpuSpecDto(entity, 'pixelFillRate'),
    textureFillRate: mapToGpuSpecDto(entity, 'textureFillRate'),
    fp32Performance: mapToGpuSpecDto(entity, 'fp32Performance'),
    fp64Performance: mapToGpuSpecDto(entity, 'fp64Performance'),

    directxVersion: mapToGpuSpecDto(entity, 'directxVersion'),
    openClVersion: mapToGpuSpecDto(entity, 'openClVersion'),
    openGlVersion: mapToGpuSpecDto(entity, 'openGlVersion'),
    shaderModelVersion: mapToGpuSpecDto(entity, 'shaderModelVersion'),
  };
}

function mapToGpuSpecDto<T>(
  entity: db.GpuSpecs,
  key: keyof db.GpuSpecs,
): GpuSpec<T> {
  if (entity[key] == null) {
    return null;
  }

  const metadata = entity.metadata as Prisma.JsonObject;

  return {
    value: entity[key] as T,
    meta: metadata?.[key] as Prisma.JsonObject,
  };
}

export function mapToGpuSpecsEntity(specs: GpuSpecs): db.GpuSpecs {
  const metadata = {};

  const mappedSpecs = {
    company: mapToGpuSpecEntity(specs, 'company', metadata),
    marketSegment: mapToGpuSpecEntity(specs, 'marketSegment', metadata),
    launchPrice: mapToGpuSpecEntity(specs, 'launchPrice', metadata),
    releaseDate: mapToGpuSpecEntity(specs, 'releaseDate', metadata),

    codename: mapToGpuSpecEntity(specs, 'codename', metadata),
    architecture: mapToGpuSpecEntity(specs, 'architecture', metadata),
    processSize: mapToGpuSpecEntity(specs, 'processSize', metadata),
    transistors: mapToGpuSpecEntity(specs, 'transistors', metadata),

    memorySize: mapToGpuSpecEntity(specs, 'memorySize', metadata),
    memoryType: mapToGpuSpecEntity(specs, 'memoryType', metadata),
    memoryClock: mapToGpuSpecEntity(specs, 'memoryClock', metadata),
    memoryInterface: mapToGpuSpecEntity(specs, 'memoryInterface', metadata),
    memoryBandwidth: mapToGpuSpecEntity(specs, 'memoryBandwidth', metadata),

    slotWidth: mapToGpuSpecEntity(specs, 'slotWidth', metadata),
    length: mapToGpuSpecEntity(specs, 'length', metadata),
    width: mapToGpuSpecEntity(specs, 'width', metadata),
    height: mapToGpuSpecEntity(specs, 'height', metadata),
    weight: mapToGpuSpecEntity(specs, 'weight', metadata),
    thermalDesignPower: mapToGpuSpecEntity(
      specs,
      'thermalDesignPower',
      metadata,
    ),
    suggestedPsu: mapToGpuSpecEntity(specs, 'suggestedPsu', metadata),
    busInterface: mapToGpuSpecEntity(specs, 'busInterface', metadata),
    powerConnectors: mapToGpuSpecEntity(specs, 'powerConnectors', metadata),
    outputs: mapToGpuSpecEntity(specs, 'outputs', metadata),

    shaderUnitsCudaCores: mapToGpuSpecEntity(
      specs,
      'shaderUnitsCudaCores',
      metadata,
    ),
    textureMappingUnits: mapToGpuSpecEntity(
      specs,
      'textureMappingUnits',
      metadata,
    ),
    renderOutputUnits: mapToGpuSpecEntity(specs, 'renderOutputUnits', metadata),
    tensorCores: mapToGpuSpecEntity(specs, 'tensorCores', metadata),
    rayTracingCores: mapToGpuSpecEntity(specs, 'rayTracingCores', metadata),
    coreClockSpeedBase: mapToGpuSpecEntity(
      specs,
      'coreClockSpeedBase',
      metadata,
    ),
    coreClockSpeedBoost: mapToGpuSpecEntity(
      specs,
      'coreClockSpeedBoost',
      metadata,
    ),
    l1Cache: mapToGpuSpecEntity(specs, 'l1Cache', metadata),
    l2Cache: mapToGpuSpecEntity(specs, 'l2Cache', metadata),

    pixelFillRate: mapToGpuSpecEntity(specs, 'pixelFillRate', metadata),
    textureFillRate: mapToGpuSpecEntity(specs, 'textureFillRate', metadata),
    fp32Performance: mapToGpuSpecEntity(specs, 'fp32Performance', metadata),
    fp64Performance: mapToGpuSpecEntity(specs, 'fp64Performance', metadata),

    directxVersion: mapToGpuSpecEntity(specs, 'directxVersion', metadata),
    openClVersion: mapToGpuSpecEntity(specs, 'openClVersion', metadata),
    openGlVersion: mapToGpuSpecEntity(specs, 'openGlVersion', metadata),
    shaderModelVersion: mapToGpuSpecEntity(
      specs,
      'shaderModelVersion',
      metadata,
    ),
  };

  return {
    ...mappedSpecs,
    gpuId: specs.gpuId,
    metadata: metadata as Prisma.JsonObject,
  };
}

function mapToGpuSpecEntity(
  specs: GpuSpecs,
  key: keyof GpuSpecs,
  metadata: { [col: string]: GpuSpecMeta },
) {
  const spec = specs?.[key];
  if (typeof spec === 'number') {
    throw new Error(`Cannot map gpu spec to entity, key=${key}`);
  }

  metadata[key] = spec?.meta ?? null;
  return spec?.value ?? null;
}
