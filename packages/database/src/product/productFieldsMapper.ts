import {
  ProductField,
  ProductFieldKey,
  ProductFieldMeta,
  ProductFields,
  ProductType,
} from '@pcpartdb/shared';
import { CpuFieldsEntity, GpuFieldsEntity } from '.';

type ProductFieldsEntity = CpuFieldsEntity | GpuFieldsEntity;

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
    'architecture',
    'busInterface',
    'codename',
    'computeUnits',
    'cudaVersion',
    'density',
    'dieSize',
    'directxVersion',
    'foundry',
    'fp16',
    'fp32',
    'fp64',
    'generation',
    'gpuCoreBaseClock',
    'gpuCoreBoostClock',
    'gpuCores',
    'height',
    'l1Cache',
    'l2Cache',
    'length',
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
    'releaseDate',
    'rops',
    'rtCores',
    'shaderClock',
    'shaderModelVersion',
    'slotWidth',
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
    'weight',
    'width',
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

  const mappedFields: Partial<Record<ProductFieldKey, ProductField>> = {};
  for (const fieldKey of FIELDS_TO_MAP[productType]) {
    mappedFields[fieldKey] = mapProductFieldToDto(entity, fieldKey, options);
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
  options?: MapToDtoOptions,
) {
  if (entity == null) {
    return undefined;
  }

  const fieldsSet = new Set(options?.fields ?? []);
  if (options?.fields != null && !fieldsSet.has(key)) {
    // Excluded from fields param, ignore this value.
    return undefined;
  }

  const entityValueKey = `${key}Value` as keyof ProductFieldsEntity;
  const entityMetaKey = `${key}Meta` as keyof ProductFieldsEntity;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (entity as any)[entityValueKey] ?? null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta: ProductFieldMeta = (entity as any)[entityMetaKey] ?? null;

  if (options?.includeAutomation !== true) {
    delete meta?.autoUpdate;
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
    if (value == null) {
      continue;
    }

    return { [entityValueKey]: value?.value, [entityMetaKey]: value?.meta };
  }

  return {};
}
