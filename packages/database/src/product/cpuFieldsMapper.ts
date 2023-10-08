import {
  CpuField,
  CpuFieldKey,
  CpuFields,
  ProductFieldKey,
} from '@pcpartdb/shared';
import { CpuFieldsEntity } from '.';

interface MapToDtoOptions {
  fields?: Set<ProductFieldKey>;
}

export function mapToCpuFieldsDto(
  entity: CpuFieldsEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    productId: entity.productId,

    ...mapCpuFieldToDto(entity, 'architecture', options),
    ...mapCpuFieldToDto(entity, 'baseClock', options),
    ...mapCpuFieldToDto(entity, 'bundledCooler', options),
    ...mapCpuFieldToDto(entity, 'chipsets', options),
    ...mapCpuFieldToDto(entity, 'clock', options),
    ...mapCpuFieldToDto(entity, 'codename', options),
    ...mapCpuFieldToDto(entity, 'cores', options),
    ...mapCpuFieldToDto(entity, 'dieSize', options),
    ...mapCpuFieldToDto(entity, 'eccMemory', options),
    ...mapCpuFieldToDto(entity, 'eCores', options),
    ...mapCpuFieldToDto(entity, 'eCoreClock', options),
    ...mapCpuFieldToDto(entity, 'eCoreL1Cache', options),
    ...mapCpuFieldToDto(entity, 'eCoreL2Cache', options),
    ...mapCpuFieldToDto(entity, 'eCoreTurboClock', options),
    ...mapCpuFieldToDto(entity, 'extensionsTechnologies', options),
    ...mapCpuFieldToDto(entity, 'foundry', options),
    ...mapCpuFieldToDto(entity, 'generation', options),
    ...mapCpuFieldToDto(entity, 'integratedGraphics', options),
    ...mapCpuFieldToDto(entity, 'l1Cache', options),
    ...mapCpuFieldToDto(entity, 'l2Cache', options),
    ...mapCpuFieldToDto(entity, 'l3Cache', options),
    ...mapCpuFieldToDto(entity, 'marketSegment', options),
    ...mapCpuFieldToDto(entity, 'memoryChannels', options),
    ...mapCpuFieldToDto(entity, 'memorySupport', options),
    ...mapCpuFieldToDto(entity, 'msrp', options),
    ...mapCpuFieldToDto(entity, 'multiplier', options),
    ...mapCpuFieldToDto(entity, 'multiplierUnlocked', options),
    ...mapCpuFieldToDto(entity, 'partNumber', options),
    ...mapCpuFieldToDto(entity, 'pciExpress', options),
    ...mapCpuFieldToDto(entity, 'pCores', options),
    ...mapCpuFieldToDto(entity, 'pCoreClock', options),
    ...mapCpuFieldToDto(entity, 'pCoreTurboClock', options),
    ...mapCpuFieldToDto(entity, 'pl1', options),
    ...mapCpuFieldToDto(entity, 'pl2', options),
    ...mapCpuFieldToDto(entity, 'ppt', options),
    ...mapCpuFieldToDto(entity, 'processSize', options),
    ...mapCpuFieldToDto(entity, 'productionStatus', options),
    ...mapCpuFieldToDto(entity, 'releaseDate', options),
    ...mapCpuFieldToDto(entity, 'smp', options),
    ...mapCpuFieldToDto(entity, 'socket', options),
    ...mapCpuFieldToDto(entity, 'tCaseMax', options),
    ...mapCpuFieldToDto(entity, 'tdp', options),
    ...mapCpuFieldToDto(entity, 'threads', options),
    ...mapCpuFieldToDto(entity, 'tjMax', options),
    ...mapCpuFieldToDto(entity, 'transistors', options),
    ...mapCpuFieldToDto(entity, 'turboClock', options),
    ...mapCpuFieldToDto(entity, 'performanceRating', options),
    ...mapCpuFieldToDto(entity, 'performancePerMsrp', options),
  } as CpuFields;
}

function mapCpuFieldToDto(
  entity: CpuFieldsEntity,
  key: CpuFieldKey,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return undefined;
  }

  if (options?.fields != null && !options?.fields?.has(key)) {
    // Excluded from fields param, ignore this value.
    return undefined;
  }

  const entityValueKey = `${key}Value` as keyof CpuFieldsEntity;
  const entityMetaKey = `${key}Meta` as keyof CpuFieldsEntity;

  return {
    [key]: {
      value: entity[entityValueKey] ?? null,
      meta: entity[entityMetaKey] ?? null,
    },
  } as Record<string, CpuField>;
}

export function mapToCpuFieldsEntity(dto: CpuFields) {
  if (dto == null) {
    return null;
  }

  return {
    id: undefined,
    productId: undefined,

    ...mapCpuFieldToEntity(dto, 'architecture'),
    ...mapCpuFieldToEntity(dto, 'baseClock'),
    ...mapCpuFieldToEntity(dto, 'bundledCooler'),
    ...mapCpuFieldToEntity(dto, 'chipsets'),
    ...mapCpuFieldToEntity(dto, 'clock'),
    ...mapCpuFieldToEntity(dto, 'codename'),
    ...mapCpuFieldToEntity(dto, 'cores'),
    ...mapCpuFieldToEntity(dto, 'dieSize'),
    ...mapCpuFieldToEntity(dto, 'eccMemory'),
    ...mapCpuFieldToEntity(dto, 'eCores'),
    ...mapCpuFieldToEntity(dto, 'eCoreClock'),
    ...mapCpuFieldToEntity(dto, 'eCoreL1Cache'),
    ...mapCpuFieldToEntity(dto, 'eCoreL2Cache'),
    ...mapCpuFieldToEntity(dto, 'eCoreTurboClock'),
    ...mapCpuFieldToEntity(dto, 'extensionsTechnologies'),
    ...mapCpuFieldToEntity(dto, 'foundry'),
    ...mapCpuFieldToEntity(dto, 'generation'),
    ...mapCpuFieldToEntity(dto, 'integratedGraphics'),
    ...mapCpuFieldToEntity(dto, 'l1Cache'),
    ...mapCpuFieldToEntity(dto, 'l2Cache'),
    ...mapCpuFieldToEntity(dto, 'l3Cache'),
    ...mapCpuFieldToEntity(dto, 'marketSegment'),
    ...mapCpuFieldToEntity(dto, 'memoryChannels'),
    ...mapCpuFieldToEntity(dto, 'memorySupport'),
    ...mapCpuFieldToEntity(dto, 'msrp'),
    ...mapCpuFieldToEntity(dto, 'multiplier'),
    ...mapCpuFieldToEntity(dto, 'multiplierUnlocked'),
    ...mapCpuFieldToEntity(dto, 'partNumber'),
    ...mapCpuFieldToEntity(dto, 'pciExpress'),
    ...mapCpuFieldToEntity(dto, 'pCores'),
    ...mapCpuFieldToEntity(dto, 'pCoreClock'),
    ...mapCpuFieldToEntity(dto, 'pCoreTurboClock'),
    ...mapCpuFieldToEntity(dto, 'pl1'),
    ...mapCpuFieldToEntity(dto, 'pl2'),
    ...mapCpuFieldToEntity(dto, 'ppt'),
    ...mapCpuFieldToEntity(dto, 'processSize'),
    ...mapCpuFieldToEntity(dto, 'productionStatus'),
    ...mapCpuFieldToEntity(dto, 'releaseDate'),
    ...mapCpuFieldToEntity(dto, 'smp'),
    ...mapCpuFieldToEntity(dto, 'socket'),
    ...mapCpuFieldToEntity(dto, 'tCaseMax'),
    ...mapCpuFieldToEntity(dto, 'tdp'),
    ...mapCpuFieldToEntity(dto, 'threads'),
    ...mapCpuFieldToEntity(dto, 'tjMax'),
    ...mapCpuFieldToEntity(dto, 'transistors'),
    ...mapCpuFieldToEntity(dto, 'turboClock'),
    ...mapCpuFieldToEntity(dto, 'performanceRating'),
    ...mapCpuFieldToEntity(dto, 'performancePerMsrp'),

    metadata: dto.metadata,
  } as CpuFieldsEntity;
}

function mapCpuFieldToEntity(dto: CpuFields, ...keyOrKeys: CpuFieldKey[]) {
  if (!keyOrKeys) {
    return {};
  }

  const primaryKey = keyOrKeys[0];
  const entityValueKey = `${primaryKey}Value` as keyof CpuFieldsEntity;
  const entityMetaKey = `${primaryKey}Meta` as keyof CpuFieldsEntity;
  for (let i = 0; i < keyOrKeys.length; ++i) {
    const key = keyOrKeys[i];
    const value = dto[key] as CpuField;
    if (value == null) {
      continue;
    }

    return { [entityValueKey]: value?.value, [entityMetaKey]: value?.meta };
  }

  return {};
}
