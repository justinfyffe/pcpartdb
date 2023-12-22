import {
  GpuField,
  GpuFieldKey,
  GpuFields,
  ProductFieldKey,
} from '@pcpartdb/shared';
import { GpuFieldsEntity } from '.';

interface MapToDtoOptions {
  fields?: ProductFieldKey[];
}

export function mapToGpuFieldsDto(
  entity: GpuFieldsEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    productId: entity.productId,
    ...mapGpuFieldToDto(entity, 'architecture', options),
    ...mapGpuFieldToDto(entity, 'busInterface', options),
    ...mapGpuFieldToDto(entity, 'codename', options),
    ...mapGpuFieldToDto(entity, 'computeUnits', options),
    ...mapGpuFieldToDto(entity, 'cudaVersion', options),
    ...mapGpuFieldToDto(entity, 'density', options),
    ...mapGpuFieldToDto(entity, 'dieSize', options),
    ...mapGpuFieldToDto(entity, 'directxVersion', options),
    ...mapGpuFieldToDto(entity, 'foundry', options),
    ...mapGpuFieldToDto(entity, 'fp16', options),
    ...mapGpuFieldToDto(entity, 'fp32', options),
    ...mapGpuFieldToDto(entity, 'fp64', options),
    ...mapGpuFieldToDto(entity, 'generation', options),
    ...mapGpuFieldToDto(entity, 'gpuCoreBaseClock', options),
    ...mapGpuFieldToDto(entity, 'gpuCoreBoostClock', options),
    ...mapGpuFieldToDto(entity, 'gpuCores', options),
    ...mapGpuFieldToDto(entity, 'height', options),
    ...mapGpuFieldToDto(entity, 'l1Cache', options),
    ...mapGpuFieldToDto(entity, 'l2Cache', options),
    ...mapGpuFieldToDto(entity, 'length', options),
    ...mapGpuFieldToDto(entity, 'marketSegment', options),
    ...mapGpuFieldToDto(entity, 'memoryBandwidth', options),
    ...mapGpuFieldToDto(entity, 'memoryClock', options),
    ...mapGpuFieldToDto(entity, 'memoryClockEffective', options),
    ...mapGpuFieldToDto(entity, 'memoryInterface', options),
    ...mapGpuFieldToDto(entity, 'memorySize', options),
    ...mapGpuFieldToDto(entity, 'memoryType', options),
    ...mapGpuFieldToDto(entity, 'msrp', options),
    ...mapGpuFieldToDto(entity, 'openClVersion', options),
    ...mapGpuFieldToDto(entity, 'openGlVersion', options),
    ...mapGpuFieldToDto(entity, 'outputs', options),
    ...mapGpuFieldToDto(entity, 'partNumber', options),
    ...mapGpuFieldToDto(entity, 'pixelRate', options),
    ...mapGpuFieldToDto(entity, 'pixelShaders', options),
    ...mapGpuFieldToDto(entity, 'powerConnectors', options),
    ...mapGpuFieldToDto(entity, 'predecessorGeneration', options),
    ...mapGpuFieldToDto(entity, 'processSize', options),
    ...mapGpuFieldToDto(entity, 'productionStatus', options),
    ...mapGpuFieldToDto(entity, 'releaseDate', options),
    ...mapGpuFieldToDto(entity, 'rops', options),
    ...mapGpuFieldToDto(entity, 'rtCores', options),
    ...mapGpuFieldToDto(entity, 'shaderClock', options),
    ...mapGpuFieldToDto(entity, 'shaderModelVersion', options),
    ...mapGpuFieldToDto(entity, 'slotWidth', options),
    ...mapGpuFieldToDto(entity, 'successorGeneration', options),
    ...mapGpuFieldToDto(entity, 'suggestedPsu', options),
    ...mapGpuFieldToDto(entity, 'tdp', options),
    ...mapGpuFieldToDto(entity, 'tensorCores', options),
    ...mapGpuFieldToDto(entity, 'textureRate', options),
    ...mapGpuFieldToDto(entity, 'tmus', options),
    ...mapGpuFieldToDto(entity, 'transistors', options),
    ...mapGpuFieldToDto(entity, 'vertexRate', options),
    ...mapGpuFieldToDto(entity, 'vertexShaders', options),
    ...mapGpuFieldToDto(entity, 'vulkanVersion', options),
    ...mapGpuFieldToDto(entity, 'weight', options),
    ...mapGpuFieldToDto(entity, 'width', options),
  } as GpuFields;
}

function mapGpuFieldToDto(
  entity: GpuFieldsEntity,
  key: GpuFieldKey,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return undefined;
  }

  const fieldsSet = new Set(...(options?.fields ?? []));
  if (options?.fields != null && fieldsSet.has(key)) {
    // Excluded from fields param, ignore this value.
    return undefined;
  }

  const entityValueKey = `${key}Value` as keyof GpuFieldsEntity;
  const entityMetaKey = `${key}Meta` as keyof GpuFieldsEntity;

  return {
    [key]: {
      value: entity[entityValueKey] ?? null,
      meta: entity[entityMetaKey] ?? null,
    },
  } as Record<string, GpuField>;
}

export function mapToGpuFieldsEntity(dto: GpuFields) {
  if (dto == null) {
    return null;
  }

  return {
    id: undefined,
    productId: undefined,

    ...mapGpuFieldToEntity(dto, 'architecture'),
    ...mapGpuFieldToEntity(dto, 'busInterface'),
    ...mapGpuFieldToEntity(dto, 'codename'),
    ...mapGpuFieldToEntity(dto, 'computeUnits'),
    ...mapGpuFieldToEntity(dto, 'cudaVersion'),
    ...mapGpuFieldToEntity(dto, 'density'),
    ...mapGpuFieldToEntity(dto, 'dieSize'),
    ...mapGpuFieldToEntity(dto, 'directxVersion'),
    ...mapGpuFieldToEntity(dto, 'foundry'),
    ...mapGpuFieldToEntity(dto, 'fp16'),
    ...mapGpuFieldToEntity(dto, 'fp32'),
    ...mapGpuFieldToEntity(dto, 'fp64'),
    ...mapGpuFieldToEntity(dto, 'generation'),
    ...mapGpuFieldToEntity(dto, 'gpuCoreBaseClock'),
    ...mapGpuFieldToEntity(dto, 'gpuCoreBoostClock'),
    ...mapGpuFieldToEntity(dto, 'gpuCores'),
    ...mapGpuFieldToEntity(dto, 'height'),
    ...mapGpuFieldToEntity(dto, 'l1Cache'),
    ...mapGpuFieldToEntity(dto, 'l2Cache'),
    ...mapGpuFieldToEntity(dto, 'length'),
    ...mapGpuFieldToEntity(dto, 'marketSegment'),
    ...mapGpuFieldToEntity(dto, 'memoryBandwidth'),
    ...mapGpuFieldToEntity(dto, 'memoryClock'),
    ...mapGpuFieldToEntity(dto, 'memoryClockEffective'),
    ...mapGpuFieldToEntity(dto, 'memoryInterface'),
    ...mapGpuFieldToEntity(dto, 'memorySize'),
    ...mapGpuFieldToEntity(dto, 'memoryType'),
    ...mapGpuFieldToEntity(dto, 'msrp'),
    ...mapGpuFieldToEntity(dto, 'openClVersion'),
    ...mapGpuFieldToEntity(dto, 'openGlVersion'),
    ...mapGpuFieldToEntity(dto, 'outputs'),
    ...mapGpuFieldToEntity(dto, 'partNumber'),
    ...mapGpuFieldToEntity(dto, 'pixelRate'),
    ...mapGpuFieldToEntity(dto, 'pixelShaders'),
    ...mapGpuFieldToEntity(dto, 'powerConnectors'),
    ...mapGpuFieldToEntity(dto, 'predecessorGeneration'),
    ...mapGpuFieldToEntity(dto, 'processSize'),
    ...mapGpuFieldToEntity(dto, 'productionStatus'),
    ...mapGpuFieldToEntity(dto, 'releaseDate'),
    ...mapGpuFieldToEntity(dto, 'rops'),
    ...mapGpuFieldToEntity(dto, 'rtCores'),
    ...mapGpuFieldToEntity(dto, 'shaderClock'),
    ...mapGpuFieldToEntity(dto, 'shaderModelVersion'),
    ...mapGpuFieldToEntity(dto, 'slotWidth'),
    ...mapGpuFieldToEntity(dto, 'successorGeneration'),
    ...mapGpuFieldToEntity(dto, 'suggestedPsu'),
    ...mapGpuFieldToEntity(dto, 'tdp'),
    ...mapGpuFieldToEntity(dto, 'tensorCores'),
    ...mapGpuFieldToEntity(dto, 'textureRate'),
    ...mapGpuFieldToEntity(dto, 'tmus'),
    ...mapGpuFieldToEntity(dto, 'transistors'),
    ...mapGpuFieldToEntity(dto, 'vertexRate'),
    ...mapGpuFieldToEntity(dto, 'vertexShaders'),
    ...mapGpuFieldToEntity(dto, 'vulkanVersion'),
    ...mapGpuFieldToEntity(dto, 'weight'),
    ...mapGpuFieldToEntity(dto, 'width'),

    metadata: dto.metadata,
  } as GpuFieldsEntity;
}

function mapGpuFieldToEntity(dto: GpuFields, ...keyOrKeys: GpuFieldKey[]) {
  if (!keyOrKeys) {
    return {};
  }

  const primaryKey = keyOrKeys[0];
  const entityValueKey = `${primaryKey}Value` as keyof GpuFieldsEntity;
  const entityMetaKey = `${primaryKey}Meta` as keyof GpuFieldsEntity;
  for (let i = 0; i < keyOrKeys.length; ++i) {
    const key = keyOrKeys[i];
    const value = dto[key] as GpuField;
    if (value == null) {
      continue;
    }

    return { [entityValueKey]: value?.value, [entityMetaKey]: value?.meta };
  }

  return {};
}
