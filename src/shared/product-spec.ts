import Joi from '@hapi/joi';
import Big from 'big.js';

export enum MarketSegment {
  Desktop = 'DESKTOP',
  Laptop = 'LAPTOP',
  Server = 'SERVER',
}

export enum ProductionStatus {
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
  Unreleased = 'UNRELEASED',
}

export enum ProductSpecBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
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
  Generation = 'GENERATION',
  Predecessor = 'PREDECESSOR',
  Successor = 'SUCCESSOR',
  MarketSegment = 'MARKET_SEGMENT',
  LaunchPrice = 'LAUNCH_PRICE',
  ReleaseDate = 'RELEASE_DATE',
  ProductionStatus = 'PRODUCTION_STATUS',

  // Processor
  GpuName = 'GPU_NAME',
  GpuVariant = 'GPU_VARIANT',
  Architecture = 'ARCHITECTURE',
  Foundry = 'FOUNDRY',
  Lithography = 'LITHOGRAPHY',
  Transistors = 'TRANSISTORS',
  DieSize = 'DIE_SIZE',

  // Cores & Clock Speeds
  CpuCores = 'CPU_CORES',
  Threads = 'THREADS',
  CudaCores = 'CUDA_CORES',
  Tmus = 'TMUS',
  Rops = 'ROPS',
  TensorCores = 'TENSOR_CORES',
  RtCores = 'RT_CORES',
  ClockMultiplier = 'CLOCK_MULTIPLIER',
  ClockMultiplierUnlocked = 'CLOCK_MULTIPLIER_UNLOCKED',
  ClockSpeedBase = 'CLOCK_SPEED_BASE',
  ClockSpeedBoost = 'CLOCK_SPEED_BOOST',
  L1Cache = 'L1_CACHE',
  L2Cache = 'L2_CACHE',
  L3Cache = 'L3_CACHE',
  IntegratedGpu = 'INTEGRATED_GPU',

  // Board Design
  CpuSocket = 'CPU_SOCKET',
  SlotWidth = 'SLOT_WIDTH',
  Length = 'LENGTH',
  Width = 'WIDTH',
  Height = 'HEIGHT',
  Weight = 'WEIGHT',
  Tdp = 'TDP',
  SuggestedPsu = 'SUGGESTED_PSU',
  BusInterface = 'BUS_INTERFACE',
  PowerConnectors = 'POWER_CONNECTORS',
  BoardNumber = 'BOARD_NUMBER',

  // Theoretical Performance
  PixelFillRate = 'PIXEL_FILL_RATE',
  TextureRate = 'TEXTURE_FILL_RATE',
  Fp32Performance = 'FP32_PERFORMANCE',
  Fp64Performance = 'FP64_PERFORMANCE',

  // Memory
  MemorySize = 'MEMORY_SIZE',
  MemoryType = 'MEMORY_TYPE',
  MemoryInterface = 'MEMORY_INTERFACE',
  MemoryBandwidth = 'MEMORY_BANDWIDTH',
  MaxMemoryBandwidth = 'MAX_MEMORY_BANDWIDTH',
  MaxMemoryChannels = 'MAX_MEMORY_CHANNELS',
  MaxMemorySize = 'MAX_MEMORY_SIZE',

  // Display Connectivity
  MaxResolution = 'MAX_RESOLUTION',
  DisplayPorts = 'DISPLAY_PORTS',
  HdmiPorts = 'HDMI_PORTS',

  // API Support
  DirectXVersion = 'DIRECT_X_VERSION',
  OpenClVersion = 'OPEN_CL_VERSION',
  OpenGlVersion = 'OPEN_GL_VERSION',
  CudaVersion = 'CUDA_VERSION',
  ShaderModelVersion = 'SHADER_MODEL_VERSION',
  GSyncFreeSyncSupport = 'G_SYNC_FREE_SYNC_SUPPORT',
  SliCrossfireSupport = 'SLI_CROSSFIRE_SUPPORT',
  VrReady = 'VR_READY',
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
  if (key === ProductSpecKey.ProductionStatus) {
    return formatProductionStatus(stringValue);
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
    returnValue = floatValue.toFixed(options?.decimals ?? 2);
  } else if (integerValue != null) {
    returnValue = `${integerValue}`;
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

function formatProductionStatus(value: string) {
  switch (value) {
    case ProductionStatus.Active:
      return 'Active';
    case ProductionStatus.EndOfLife:
      return 'End of Life';
    case ProductionStatus.Unreleased:
      return 'Unreleased';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}
