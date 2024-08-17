import { parseISO } from 'date-fns';
import { Product, ProductType } from '../common';
import {
  PRODUCT_FIELD_LABELS,
  ProductField,
  ProductFieldKey,
  ProductionStatus,
} from './common';
import { CpuFields } from './cpu';
import { GpuFields } from './gpu';

export function getProductFieldLabel(
  productType: ProductType,
  field: ProductFieldKey,
) {
  return PRODUCT_FIELD_LABELS?.[productType]?.[field] ?? null;
}

// These shouldn't be set on the raw value, but occasionally slip through.
const INVALID_RAW_VALUES: unknown[] = [
  'motherboard dependent',
  'portable device dependent',
  'device dependent',
  'system dependent',
  'system shared',
];
export function hasProductFieldRawValue(field: ProductField) {
  if (field == null) {
    return false;
  }

  if (field.value == null) {
    return false;
  }

  if (typeof field.value === 'string') {
    const trimmedValue = field.value.trim();
    if (INVALID_RAW_VALUES.includes(trimmedValue.toLowerCase())) {
      return false;
    } else if (trimmedValue === '') {
      return false;
    }

    return true;
  }

  if (Array.isArray(field.value)) {
    return (
      field.value.filter((value) => value != null && value !== '').length > 0
    );
  }

  return true;
}

export function hasProductFieldFormattedValue(field?: ProductField) {
  if (field == null) {
    return false;
  }

  if (field.meta?.formattedValue == null) {
    return false;
  }

  if (field.meta?.formattedValue === '') {
    return false;
  }

  return true;
}

export function hasProductFieldValue(field?: ProductField) {
  return hasProductFieldRawValue(field) || hasProductFieldFormattedValue(field);
}

export function productFieldRawValue<T = unknown>(field?: ProductField<T>) {
  if (!hasProductFieldRawValue(field)) {
    return null;
  }

  return field.value as T;
}

export function productFieldFormattedValue(field?: ProductField) {
  if (!hasProductFieldFormattedValue(field)) {
    return null;
  }

  return field.meta?.formattedValue ?? null;
}

export function isProductField(value: unknown): value is ProductField {
  return (
    value != null &&
    typeof value === 'object' &&
    'value' in value &&
    'meta' in value
  );
}

export function compareProductFields(
  field1: ProductField,
  field2: ProductField,
) {
  if (hasProductFieldRawValue(field1) && !hasProductFieldRawValue(field2)) {
    return -1;
  } else if (
    !hasProductFieldRawValue(field1) &&
    hasProductFieldRawValue(field2)
  ) {
    return 1;
  } else if (
    !hasProductFieldRawValue(field1) &&
    !hasProductFieldRawValue(field2)
  ) {
    return 0;
  }

  if (field1.meta?.fieldKey !== field2.meta?.fieldKey) {
    throw new Error('Cannot compare two different types of fields');
  }

  if (typeof field1.value === 'number' && typeof field2.value === 'number') {
    return field1.value - field2.value;
  } else if (
    typeof field1.value === 'string' &&
    typeof field2.value === 'string'
  ) {
    return field1.value.localeCompare(field2.value);
  } else if (
    typeof field1.value === 'boolean' &&
    typeof field2.value === 'boolean'
  ) {
    if (field1.value && !field2.value) {
      return 1;
    } else if (!field1.value && field2.value) {
      return -1;
    } else {
      return 0;
    }
  } else if (
    Array.isArray(field1.value || []) &&
    Array.isArray(field2.value || [])
  ) {
    const arr1 = (field1.value as unknown[]) || [];
    const arr2 = (field2.value as unknown[]) || [];
    return arr1.join(',').localeCompare(arr2.join(','));
  } else {
    throw new Error(
      `Cannot compare fields. Invalid type ${typeof field1.value} (${
        field1.value
      }) and ${typeof field2.value} (${field2.value})`,
    );
  }
}

export function isPastLaunchDate(product: Product) {
  if (!hasProductFieldRawValue(product?.fields?.releaseDate)) {
    return false;
  }

  const date = new Date();
  const releaseDate = parseISO(
    productFieldRawValue(product?.fields.releaseDate),
  );
  return date.getTime() >= releaseDate.getTime();
}

export function hasLaunched(product: Product) {
  if (
    productFieldRawValue(product?.fields?.productionStatus) ===
      ProductionStatus.Unreleased ||
    !isPastLaunchDate(product)
  ) {
    return false;
  }

  return true;
}

export function createEmptyProductField(fieldKey: ProductFieldKey) {
  return {
    value: null,
    meta: {
      fieldKey,
      autoUpdate: true,
      formattedValue: null,
    },
  } as ProductField;
}

export function createEmptyCpuFields() {
  return {
    architecture: createEmptyProductField('architecture'),
    baseClock: createEmptyProductField('baseClock'),
    bundledCooler: createEmptyProductField('bundledCooler'),
    chipsets: createEmptyProductField('chipsets'),
    clock: createEmptyProductField('clock'),
    codename: createEmptyProductField('codename'),
    cores: createEmptyProductField('cores'),
    dieSize: createEmptyProductField('dieSize'),
    eccMemory: createEmptyProductField('eccMemory'),
    eCores: createEmptyProductField('eCores'),
    eCoreClock: createEmptyProductField('eCoreClock'),
    eCoreL1Cache: createEmptyProductField('eCoreL1Cache'),
    eCoreL2Cache: createEmptyProductField('eCoreL2Cache'),
    eCoreTurboClock: createEmptyProductField('eCoreTurboClock'),
    extensionsTechnologies: createEmptyProductField('extensionsTechnologies'),
    foundry: createEmptyProductField('foundry'),
    generation: createEmptyProductField('generation'),
    integratedGraphics: createEmptyProductField('integratedGraphics'),
    l1Cache: createEmptyProductField('l1Cache'),
    l2Cache: createEmptyProductField('l2Cache'),
    l3Cache: createEmptyProductField('l3Cache'),
    marketSegment: createEmptyProductField('marketSegment'),
    memoryChannels: createEmptyProductField('memoryChannels'),
    memorySupport: createEmptyProductField('memorySupport'),
    msrp: createEmptyProductField('msrp'),
    multiplier: createEmptyProductField('multiplier'),
    multiplierUnlocked: createEmptyProductField('multiplierUnlocked'),
    partNumber: createEmptyProductField('partNumber'),
    pciExpress: createEmptyProductField('pciExpress'),
    pCores: createEmptyProductField('pCores'),
    pCoreClock: createEmptyProductField('pCoreClock'),
    pCoreTurboClock: createEmptyProductField('pCoreTurboClock'),
    pl1: createEmptyProductField('pl1'),
    pl2: createEmptyProductField('pl2'),
    ppt: createEmptyProductField('ppt'),
    processSize: createEmptyProductField('processSize'),
    productionStatus: createEmptyProductField('productionStatus'),
    releaseDate: createEmptyProductField('releaseDate'),
    smp: createEmptyProductField('smp'),
    socket: createEmptyProductField('socket'),
    tCaseMax: createEmptyProductField('tCaseMax'),
    tdp: createEmptyProductField('tdp'),
    threads: createEmptyProductField('threads'),
    tjMax: createEmptyProductField('tjMax'),
    transistors: createEmptyProductField('transistors'),
    turboClock: createEmptyProductField('turboClock'),

    metadata: {},
  } as CpuFields;
}

export function createEmptyGpuFields() {
  return {
    aiAccelerators: createEmptyProductField('aiAccelerators'),
    architecture: createEmptyProductField('architecture'),
    busInterface: createEmptyProductField('busInterface'),
    codename: createEmptyProductField('codename'),
    computeUnits: createEmptyProductField('computeUnits'),
    cudaCores: createEmptyProductField('cudaCores'),
    cudaVersion: createEmptyProductField('cudaVersion'),
    density: createEmptyProductField('density'),
    dieSize: createEmptyProductField('dieSize'),
    directxVersion: createEmptyProductField('directxVersion'),
    executionUnits: createEmptyProductField('executionUnits'),
    foundry: createEmptyProductField('foundry'),
    fp16: createEmptyProductField('fp16'),
    fp32: createEmptyProductField('fp32'),
    fp64: createEmptyProductField('fp64'),
    generation: createEmptyProductField('generation'),
    gpuCoreBaseClock: createEmptyProductField('gpuCoreBaseClock'),
    gpuCoreBoostClock: createEmptyProductField('gpuCoreBoostClock'),
    gpuCoreGameClock: createEmptyProductField('gpuCoreGameClock'),
    l1Cache: createEmptyProductField('l1Cache'),
    l2Cache: createEmptyProductField('l2Cache'),
    marketSegment: createEmptyProductField('marketSegment'),
    memoryBandwidth: createEmptyProductField('memoryBandwidth'),
    memoryClock: createEmptyProductField('memoryClock'),
    memoryClockEffective: createEmptyProductField('memoryClockEffective'),
    memoryInterface: createEmptyProductField('memoryInterface'),
    memorySize: createEmptyProductField('memorySize'),
    memoryType: createEmptyProductField('memoryType'),
    msrp: createEmptyProductField('msrp'),
    openClVersion: createEmptyProductField('openClVersion'),
    openGlVersion: createEmptyProductField('openGlVersion'),
    outputs: createEmptyProductField('outputs'),
    partNumber: createEmptyProductField('partNumber'),
    pixelRate: createEmptyProductField('pixelRate'),
    pixelShaders: createEmptyProductField('pixelShaders'),
    powerConnectors: createEmptyProductField('powerConnectors'),
    predecessorGeneration: createEmptyProductField('predecessorGeneration'),
    processSize: createEmptyProductField('processSize'),
    productionStatus: createEmptyProductField('productionStatus'),
    rayAccelerators: createEmptyProductField('rayAccelerators'),
    rayTracingUnits: createEmptyProductField('rayTracingUnits'),
    releaseDate: createEmptyProductField('releaseDate'),
    rops: createEmptyProductField('rops'),
    shaderClock: createEmptyProductField('shaderClock'),
    shaderModelVersion: createEmptyProductField('shaderModelVersion'),
    shadingUnits: createEmptyProductField('shadingUnits'),
    slotWidth: createEmptyProductField('slotWidth'),
    streamProcessors: createEmptyProductField('streamProcessors'),
    streamMultiprocessors: createEmptyProductField('streamMultiprocessors'),
    successorGeneration: createEmptyProductField('successorGeneration'),
    suggestedPsu: createEmptyProductField('suggestedPsu'),
    tdp: createEmptyProductField('tdp'),
    tensorCores: createEmptyProductField('tensorCores'),
    textureRate: createEmptyProductField('textureRate'),
    tmus: createEmptyProductField('tmus'),
    transistors: createEmptyProductField('transistors'),
    vertexRate: createEmptyProductField('vertexRate'),
    vertexShaders: createEmptyProductField('vertexShaders'),
    vulkanVersion: createEmptyProductField('vulkanVersion'),
    xeMatrixExtensions: createEmptyProductField('xeMatrixExtensions'),

    metadata: {},
  } as GpuFields;
}
