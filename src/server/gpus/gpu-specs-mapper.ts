import { Prisma } from '@prisma/client';
import { GpuSpecs } from '@shared/gpus';
import { GpuSpecsEntity } from './gpu-entity';
import { mapToGpuFieldDto, mapToGpuFieldEntity } from './gpu-field-mapper';

export function mapToGpuSpecsDto(entity: GpuSpecsEntity): GpuSpecs {
  if (entity == null) {
    return null;
  }

  return {
    gpuId: entity.gpuId,

    codename: mapToGpuFieldDto(entity, 'codename'),
    architecture: mapToGpuFieldDto(entity, 'architecture'),
    processSize: mapToGpuFieldDto(entity, 'processSize'),
    transistors: mapToGpuFieldDto(entity, 'transistors'),

    memorySize: mapToGpuFieldDto(entity, 'memorySize'),
    memoryType: mapToGpuFieldDto(entity, 'memoryType'),
    memoryClock: mapToGpuFieldDto(entity, 'memoryClock'),
    memoryInterface: mapToGpuFieldDto(entity, 'memoryInterface'),
    memoryBandwidth: mapToGpuFieldDto(entity, 'memoryBandwidth'),

    slotWidth: mapToGpuFieldDto(entity, 'slotWidth'),
    length: mapToGpuFieldDto(entity, 'length'),
    width: mapToGpuFieldDto(entity, 'width'),
    height: mapToGpuFieldDto(entity, 'height'),
    weight: mapToGpuFieldDto(entity, 'weight'),
    thermalDesignPower: mapToGpuFieldDto(entity, 'thermalDesignPower'),
    suggestedPsu: mapToGpuFieldDto(entity, 'suggestedPsu'),
    busInterface: mapToGpuFieldDto(entity, 'busInterface'),
    powerConnectors: mapToGpuFieldDto(entity, 'powerConnectors'),
    outputs: mapToGpuFieldDto(entity, 'outputs'),

    shaderUnitsCudaCores: mapToGpuFieldDto(entity, 'shaderUnitsCudaCores'),
    computeUnitsSmCount: mapToGpuFieldDto(entity, 'computeUnitsSmCount'),
    textureMappingUnits: mapToGpuFieldDto(entity, 'textureMappingUnits'),
    renderOutputUnits: mapToGpuFieldDto(entity, 'renderOutputUnits'),
    tensorCores: mapToGpuFieldDto(entity, 'tensorCores'),
    rayTracingCores: mapToGpuFieldDto(entity, 'rayTracingCores'),
    coreClockSpeedBase: mapToGpuFieldDto(entity, 'coreClockSpeedBase'),
    coreClockSpeedBoost: mapToGpuFieldDto(entity, 'coreClockSpeedBoost'),
    l1Cache: mapToGpuFieldDto(entity, 'l1Cache'),
    l2Cache: mapToGpuFieldDto(entity, 'l2Cache'),

    pixelFillRate: mapToGpuFieldDto(entity, 'pixelFillRate'),
    textureFillRate: mapToGpuFieldDto(entity, 'textureFillRate'),
    fp32Performance: mapToGpuFieldDto(entity, 'fp32Performance'),
    fp64Performance: mapToGpuFieldDto(entity, 'fp64Performance'),

    directxVersion: mapToGpuFieldDto(entity, 'directxVersion'),
    openClVersion: mapToGpuFieldDto(entity, 'openClVersion'),
    openGlVersion: mapToGpuFieldDto(entity, 'openGlVersion'),
    shaderModelVersion: mapToGpuFieldDto(entity, 'shaderModelVersion'),
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
