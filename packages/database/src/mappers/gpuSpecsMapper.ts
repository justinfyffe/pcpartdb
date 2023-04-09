import { GpuSpecs } from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { GpuSpecsEntity } from '../gpu';
import { mapToGpuFieldDto, mapToGpuFieldEntity } from './gpuFieldMapper';

interface MapToDtoOptions {
  fields?: Set<string>;
  includeSources?: boolean;
}

export function mapToGpuSpecsDto(
  entity: GpuSpecsEntity,
  options?: MapToDtoOptions,
): GpuSpecs {
  if (entity == null) {
    return null;
  }

  return {
    gpuId: entity.gpuId,

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
  };
}

export function mapToGpuSpecsEntity(specs: GpuSpecs): GpuSpecsEntity {
  if (specs == null) {
    return null;
  }

  const metadata = {};

  const mappedSpecs: Partial<GpuSpecsEntity> = {
    codename: mapToGpuFieldEntity(specs, 'codename', metadata),
    architecture: mapToGpuFieldEntity(specs, 'architecture', metadata),
    processSize: mapToGpuFieldEntity(specs, 'processSize', metadata),
    transistors: mapToGpuFieldEntity(specs, 'transistors', metadata),

    memorySize: mapToGpuFieldEntity(specs, 'memorySize', metadata),
    memoryType: mapToGpuFieldEntity(specs, 'memoryType', metadata),
    memoryClock: mapToGpuFieldEntity(specs, 'memoryClock', metadata),
    memoryInterface: mapToGpuFieldEntity(specs, 'memoryInterface', metadata),
    memoryBandwidth: mapToGpuFieldEntity(specs, 'memoryBandwidth', metadata),

    slotWidth: mapToGpuFieldEntity(specs, 'slotWidth', metadata),
    length: mapToGpuFieldEntity(specs, 'length', metadata),
    width: mapToGpuFieldEntity(specs, 'width', metadata),
    height: mapToGpuFieldEntity(specs, 'height', metadata),
    weight: mapToGpuFieldEntity(specs, 'weight', metadata),
    thermalDesignPower: mapToGpuFieldEntity(
      specs,
      'thermalDesignPower',
      metadata,
    ),
    suggestedPsu: mapToGpuFieldEntity(specs, 'suggestedPsu', metadata),
    busInterface: mapToGpuFieldEntity(specs, 'busInterface', metadata),
    powerConnectors: mapToGpuFieldEntity(specs, 'powerConnectors', metadata),
    outputs: mapToGpuFieldEntity(specs, 'outputs', metadata),

    shaderUnitsCudaCores: mapToGpuFieldEntity(
      specs,
      'shaderUnitsCudaCores',
      metadata,
    ),
    computeUnitsSmCount: mapToGpuFieldEntity(
      specs,
      'computeUnitsSmCount',
      metadata,
    ),
    textureMappingUnits: mapToGpuFieldEntity(
      specs,
      'textureMappingUnits',
      metadata,
    ),
    renderOutputUnits: mapToGpuFieldEntity(
      specs,
      'renderOutputUnits',
      metadata,
    ),
    tensorCores: mapToGpuFieldEntity(specs, 'tensorCores', metadata),
    rayTracingCores: mapToGpuFieldEntity(specs, 'rayTracingCores', metadata),
    coreClockSpeedBase: mapToGpuFieldEntity(
      specs,
      'coreClockSpeedBase',
      metadata,
    ),
    coreClockSpeedBoost: mapToGpuFieldEntity(
      specs,
      'coreClockSpeedBoost',
      metadata,
    ),
    l1Cache: mapToGpuFieldEntity(specs, 'l1Cache', metadata),
    l2Cache: mapToGpuFieldEntity(specs, 'l2Cache', metadata),

    pixelFillRate: mapToGpuFieldEntity(specs, 'pixelFillRate', metadata),
    textureFillRate: mapToGpuFieldEntity(specs, 'textureFillRate', metadata),
    fp32Performance: mapToGpuFieldEntity(specs, 'fp32Performance', metadata),
    fp64Performance: mapToGpuFieldEntity(specs, 'fp64Performance', metadata),

    directxVersion: mapToGpuFieldEntity(specs, 'directxVersion', metadata),
    openClVersion: mapToGpuFieldEntity(specs, 'openClVersion', metadata),
    openGlVersion: mapToGpuFieldEntity(specs, 'openGlVersion', metadata),
    shaderModelVersion: mapToGpuFieldEntity(
      specs,
      'shaderModelVersion',
      metadata,
    ),
  };

  return {
    ...mappedSpecs,
    gpuId: undefined,
    metadata: metadata as Prisma.JsonObject,
  } as GpuSpecsEntity;
}
