import Joi from '@hapi/joi';
import Big from 'big.js';
import { format, parse } from 'date-fns';

export enum MarketSegment {
  Desktop = 'DESKTOP',
  Laptop = 'LAPTOP',
  Server = 'SERVER',
}

export enum ProductSpecBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export enum ProductSpecDateFormatter {
  QuarterYear = 'QQQ yyyy',
}

export enum ClockSpeed {
  KHz = 'KHz',
  MHz = 'MHz',
  GHz = 'GHz',
}

export enum Storage {
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
}

export type Memory = Storage;

export enum Bandwidth {
  Kbps = 'Kb/s',
  Mbps = 'Mb/s',
  Gbps = 'Gb/s',
}

export enum PixelFillRate {
  GPixelps = 'GPixel/s',
}

export enum TextureFillRate {
  GTexelps = 'GTexel/s',
}

export enum ProductSpecKey {
  // General
  Company = 'COMPANY',
  MarketSegment = 'MARKET_SEGMENT',
  LaunchPriceMsrp = 'LAUNCH_PRICE_MSRP',
  ReleaseDate = 'RELEASE_DATE',

  // Processor
  GpuName = 'GPU_NAME',
  Architecture = 'ARCHITECTURE',
  ProcessSize = 'PROCESS_SIZE',
  Transistors = 'TRANSISTORS',

  // Memory
  MemorySize = 'MEMORY_SIZE',
  MemoryType = 'MEMORY_TYPE',
  MemoryClock = 'MEMORY_CLOCK',
  MemoryInterface = 'MEMORY_INTERFACE',
  MemoryBandwidth = 'MEMORY_BANDWIDTH',

  // Board Design
  SlotWidth = 'SLOT_WIDTH',
  Length = 'LENGTH',
  Width = 'WIDTH',
  Height = 'HEIGHT',
  Weight = 'WEIGHT',
  Tdp = 'TDP',
  SuggestedPsu = 'SUGGESTED_PSU',
  BusInterface = 'BUS_INTERFACE',
  PowerConnectors = 'POWER_CONNECTORS',
  Outputs = 'OUTPUTS',

  // Cores & Clock Speeds
  ShaderUnitsCudaCores = 'SHADER_UNITS_CUDA_CORES',
  TextureMappingUnits = 'TEXTURE_MAPPING_UNIT',
  RenderOutputUnits = 'RENDER_OUTPUT_UNITS',
  TensorCores = 'TENSOR_CORES',
  RayTracingCores = 'RAY_TRACING_CORES',
  CoreClockSpeedBase = 'CORE_CLOCK_SPEED_BASE',
  CoreClockSpeedBoost = 'CORE_CLOCK_SPEED_BOOST',
  L1Cache = 'L1_CACHE',
  L2Cache = 'L2_CACHE',

  // Theoretical Performance
  PixelFillRate = 'PIXEL_FILL_RATE',
  TextureFillRate = 'TEXTURE_FILL_RATE',
  Fp32Performance = 'FP32_PERFORMANCE',
  Fp64Performance = 'FP64_PERFORMANCE',

  // API Support
  GSyncFreeSyncSupport = 'G_SYNC_FREE_SYNC_SUPPORT',
  SliCrossfireSupport = 'SLI_CROSSFIRE_SUPPORT',
  DirectXVersion = 'DIRECT_X_VERSION',
  OpenClVersion = 'OPEN_CL_VERSION',
  OpenGlVersion = 'OPEN_GL_VERSION',
  ShaderModelVersion = 'SHADER_MODEL_VERSION',
}

export interface ProductSpecMetadata {
  prefix?: string;
  suffix?: string;
}

export interface ProductSpec {
  key: ProductSpecKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: ProductSpecMetadata;
}

export type ProductSpecRequest = ProductSpec;

export type ProductSpecMap = Partial<Record<ProductSpecKey, ProductSpec>>;

export const productSpecValidator = Joi.object({
  key: Joi.string().required(),

  integerValue: Joi.number().allow(null),
  floatValue: Joi.number().allow(null),
  booleanValue: Joi.boolean().allow(null),
  stringValue: Joi.string().allow(null),
  textValue: Joi.string().allow(null),
  jsonValue: Joi.any().allow(null),

  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export function productSpecValue(spec: ProductSpec) {
  return (
    spec?.booleanValue ??
    spec?.floatValue ??
    spec?.integerValue ??
    spec?.jsonValue ??
    spec?.stringValue ??
    spec?.textValue ??
    null
  );
}

const clockSpeedMultiplier: Record<ClockSpeed, number> = {
  [ClockSpeed.KHz]: 1_000,
  [ClockSpeed.MHz]: 1_000_000,
  [ClockSpeed.GHz]: 1_000_000_000,
};

const storageMultiplier: Record<Storage, number> = {
  [Storage.KB]: 1_000,
  [Storage.MB]: 1_000_000,
  [Storage.GB]: 1_000_000_000,
  [Storage.TB]: 1_000_000_000_000,
};

const bandwidthMultiplier: Record<Bandwidth, number> = {
  [Bandwidth.Kbps]: 1_000,
  [Bandwidth.Mbps]: 1_000_000,
  [Bandwidth.Gbps]: 1_000_000_000,
};

const pixelFillRate: Record<PixelFillRate, number> = {
  [PixelFillRate.GPixelps]: 1_000_000_000,
};

const textureFillRate: Record<TextureFillRate, number> = {
  [TextureFillRate.GTexelps]: 1_000_000_000,
};

function productSpecValueMultiplier(spec: ProductSpec) {
  const { metadata } = spec;

  if (metadata?.suffix == null) {
    return 1;
  }

  const { suffix } = metadata;

  switch (suffix) {
    case ClockSpeed.KHz:
    case ClockSpeed.MHz:
    case ClockSpeed.GHz:
      return clockSpeedMultiplier[suffix];
    case Storage.KB:
    case Storage.MB:
    case Storage.GB:
    case Storage.TB:
      return storageMultiplier[suffix];
    case Bandwidth.Kbps:
    case Bandwidth.Mbps:
    case Bandwidth.Gbps:
      return bandwidthMultiplier[suffix];
    case PixelFillRate.GPixelps:
      return pixelFillRate[suffix];
    case TextureFillRate.GTexelps:
      return textureFillRate[suffix];
    default:
      return 1;
  }
}

export function compareProductSpecs(spec1: ProductSpec, spec2: ProductSpec) {
  const {
    key: key1,
    booleanValue: booleanValue1,
    floatValue: floatValue1,
    integerValue: integerValue1,
    jsonValue: jsonValue1,
    stringValue: stringValue1,
    textValue: textValue1,
  } = spec1;

  const {
    key: key2,
    booleanValue: booleanValue2,
    floatValue: floatValue2,
    integerValue: integerValue2,
    jsonValue: jsonValue2,
    stringValue: stringValue2,
    textValue: textValue2,
  } = spec2;

  // Check unsupported types
  if (key1 !== key2) {
    throw new Error('Cannot compare different types of specs');
  }

  if (booleanValue1 != null || booleanValue2 != null) {
    throw new Error('Cannot compare boolean specs');
  }

  if (jsonValue1 != null || jsonValue2 != null) {
    throw new Error('Cannot compare json specs');
  }

  // Handle text-based comparisons
  if (stringValue1 != null && stringValue2 != null) {
    return stringValue1.localeCompare(stringValue2);
  }

  if (textValue1 != null && textValue2 != null) {
    return textValue1.localeCompare(textValue2);
  }

  // Handle numberic-based comparisons
  if (integerValue1 != null && integerValue2 != null) {
    const value1 = Big(integerValue1).mul(productSpecValueMultiplier(spec1));
    const value2 = Big(integerValue2).mul(productSpecValueMultiplier(spec2));

    return value1.cmp(value2);
  }

  if (floatValue1 != null && floatValue2) {
    const value1 = Big(floatValue1).mul(productSpecValueMultiplier(spec1));
    const value2 = Big(floatValue2).mul(productSpecValueMultiplier(spec2));

    return value1.cmp(value2);
  }

  throw new Error('Cannot compare unknown speecs');
}

export interface FormatProductSpecOptions {
  decimals?: number;
  booleanFormatter?: ProductSpecBooleanFormatter;
  dateFormatter?: ProductSpecDateFormatter;
  prefix?: boolean;
  suffix?: boolean;
}

export function formatProductSpec(
  spec: ProductSpec,
  options?: FormatProductSpecOptions,
) {
  if (productSpecValue(spec) == null) {
    return '--';
  }

  const {
    key,
    booleanValue,
    floatValue,
    integerValue,
    jsonValue,
    stringValue,
    textValue,
    metadata,
  } = spec;

  // Handle special cases
  if (key === ProductSpecKey.MarketSegment) {
    return formatMarketSegment(stringValue);
  }
  if (key === ProductSpecKey.ReleaseDate) {
    return formatReleaseDate(
      stringValue,
      options?.dateFormatter ?? ProductSpecDateFormatter.QuarterYear,
    );
  }

  // Handle cases that we cannot output.
  if (jsonValue != null) {
    throw new Error('Cannot format a json value');
  }

  // Compute string to return
  let returnValue = '';
  if (booleanValue != null) {
    returnValue = formatBooleanValue(
      booleanValue,
      options?.booleanFormatter ?? ProductSpecBooleanFormatter.TrueFalse,
    );
  } else if (floatValue != null) {
    returnValue = floatValue.toLocaleString(undefined, {
      minimumFractionDigits: options?.decimals ?? 0,
      maximumFractionDigits: options?.decimals ?? 0,
    });
  } else if (integerValue != null) {
    returnValue = integerValue.toLocaleString();
  } else if (stringValue != null) {
    returnValue = stringValue;
  } else if (textValue != null) {
    returnValue = textValue;
  }

  // Apply modifiers
  const prefix = metadata?.prefix ?? null;
  const suffix = metadata?.suffix ?? null;

  if ((options?.prefix ?? true) && prefix != null) {
    returnValue = `${prefix}${returnValue}`;
  }

  if ((options?.suffix ?? true) && suffix != null) {
    returnValue = `${returnValue} ${suffix}`;
  }

  return returnValue;
}

function formatBooleanValue(
  value: boolean,
  formatter: ProductSpecBooleanFormatter,
) {
  if (formatter === ProductSpecBooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === ProductSpecBooleanFormatter.YesNo) {
    return value ? 'Yes' : 'No';
  } else {
    throw new Error(`Invalid boolean formatter: ${formatter}`);
  }
}

function formatMarketSegment(value: string) {
  switch (value) {
    case MarketSegment.Desktop:
      return 'Desktop';
    case MarketSegment.Laptop:
      return 'Laptop';
    case MarketSegment.Server:
      return 'Server';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}

function formatReleaseDate(value: string, formatter: ProductSpecDateFormatter) {
  const date = parse(value, 'yyyy-MM-dd', new Date());
  return format(date, formatter);
}
