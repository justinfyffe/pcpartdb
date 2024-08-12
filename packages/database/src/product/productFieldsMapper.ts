import {
  ProductField,
  ProductFieldKey,
  ProductFieldMeta,
  ProductFields,
  ProductType,
} from '@pcpartdb/shared';
import { CpuFieldsEntity, GpuFieldsEntity } from '.';

export type ProductFieldsEntity = CpuFieldsEntity | GpuFieldsEntity;

const FIELDS_TO_MAP: Record<ProductType, ProductFieldKey[]> = {
  [ProductType.Cpu]: [
    'architecture',
    'baseClock',
    'bundledCooler',
    'chipsets',
    'clock',
    'codename',
    'cores',
    'dieSize',
    'eccMemory',
    'eCores',
    'eCoreClock',
    'eCoreL1Cache',
    'eCoreL2Cache',
    'eCoreTurboClock',
    'extensionsTechnologies',
    'foundry',
    'generation',
    'integratedGraphics',
    'l1Cache',
    'l2Cache',
    'l3Cache',
    'marketSegment',
    'memoryChannels',
    'memorySupport',
    'msrp',
    'multiplier',
    'multiplierUnlocked',
    'partNumber',
    'pciExpress',
    'pCores',
    'pCoreClock',
    'pCoreTurboClock',
    'pl1',
    'pl2',
    'ppt',
    'processSize',
    'productionStatus',
    'releaseDate',
    'smp',
    'socket',
    'tCaseMax',
    'tdp',
    'threads',
    'tjMax',
    'transistors',
    'turboClock',
  ],
  [ProductType.Gpu]: [
    'aiAccelerators',
    'architecture',
    'busInterface',
    'codename',
    'computeUnits',
    'cudaCores',
    'cudaVersion',
    'density',
    'dieSize',
    'directxVersion',
    'executionUnits',
    'foundry',
    'fp16',
    'fp32',
    'fp64',
    'generation',
    'gpuCoreBaseClock',
    'gpuCoreBoostClock',
    'gpuCoreGameClock',
    'l1Cache',
    'l2Cache',
    'marketSegment',
    'memoryBandwidth',
    'memoryClock',
    'memoryClockEffective',
    'memoryInterface',
    'memorySize',
    'memoryType',
    'msrp',
    'openClVersion',
    'openGlVersion',
    'outputs',
    'partNumber',
    'pixelRate',
    'pixelShaders',
    'powerConnectors',
    'predecessorGeneration',
    'processSize',
    'productionStatus',
    'rayAccelerators',
    'rayTracingUnits',
    'releaseDate',
    'rops',
    'rtCores',
    'shaderClock',
    'shaderModelVersion',
    'shadingUnits',
    'slotWidth',
    'streamMultiprocessors',
    'streamProcessors',
    'successorGeneration',
    'suggestedPsu',
    'tdp',
    'tensorCores',
    'textureRate',
    'tmus',
    'transistors',
    'vertexRate',
    'vertexShaders',
    'vulkanVersion',
    'xeMatrixExtensions',
  ],
};

interface MapToDtoOptions {
  fields?: ProductFieldKey[];
  includeAutomation?: boolean;
}

export function mapToProductFieldsDto(
  productType: ProductType,
  entity: ProductFieldsEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return null;
  }

  const fieldsSet = new Set(options?.fields ?? []);
  const mappedFields: Partial<Record<ProductFieldKey, ProductField>> = {};
  for (const fieldKey of FIELDS_TO_MAP[productType]) {
    mappedFields[fieldKey] = mapProductFieldToDto(entity, fieldKey, {
      ...options,
      fieldsSet,
    });
  }

  return {
    ...mappedFields,

    id: entity.id,
    productId: entity.productId,
  } as ProductFields;
}

function mapProductFieldToDto(
  entity: ProductFieldsEntity,
  key: ProductFieldKey,
  options?: MapToDtoOptions & { fieldsSet: Set<string> },
) {
  if (entity == null) {
    return undefined;
  }

  if (options?.fields != null && !options?.fieldsSet.has(key)) {
    // Excluded from fields param, ignore this value.
    return undefined;
  }

  const entityValueKey = `${key}Value` as keyof ProductFieldsEntity;
  const entityMetaKey = `${key}Meta` as keyof ProductFieldsEntity;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (entity as any)[entityValueKey] ?? null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let meta: ProductFieldMeta = (entity as any)[entityMetaKey] ?? null;

  if (options?.includeAutomation !== true && meta != null) {
    const { autoUpdate: _autoUpdate, ...remaining } = meta;
    meta = remaining;
  }

  return { value, meta } as ProductField;
}

export function mapToProductFieldsEntity(
  productType: ProductType,
  dto: ProductFields,
) {
  if (dto == null) {
    return null;
  }

  let mappedFields = {};
  for (const fieldKey of FIELDS_TO_MAP[productType]) {
    mappedFields = {
      ...mappedFields,
      ...mapProductFieldToEntity(dto, fieldKey),
    };
  }

  return {
    ...mappedFields,

    id: undefined,
    productId: undefined,

    metadata: dto.metadata,
  } as ProductFieldsEntity;
}

function mapProductFieldToEntity(
  dto: ProductFields,
  ...keyOrKeys: ProductFieldKey[]
) {
  if (!keyOrKeys) {
    return {};
  }

  const primaryKey = keyOrKeys[0];
  const entityValueKey = `${primaryKey}Value` as keyof ProductFieldKey;
  const entityMetaKey = `${primaryKey}Meta` as keyof ProductFieldKey;
  for (let i = 0; i < keyOrKeys.length; ++i) {
    const key = keyOrKeys[i];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (dto as any)[key] as ProductField;
    if (value === undefined) {
      continue;
    }
    return {
      [entityValueKey]: value?.value ?? null,
      [entityMetaKey]: value?.meta ?? null,
    };
  }

  return {};
}
