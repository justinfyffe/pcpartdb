export enum BandwidthUnit {
  kbps = 'kbps',
  mbps = 'mbps',
  gbps = 'gbps',
}

export enum BitUnit {
  bit = 'bit',
}

export enum CurrencyUnit {
  USD = 'USD',
}

export enum ClockSpeedUnit {
  khz = 'khz',
  mhz = 'mhz',
  ghz = 'ghz',
}

export enum FlopsUnit {
  gflops = 'gflops',
  tflops = 'tflops',
}

export enum LengthUnit {
  um = 'μm',
  nm = 'nm',
  mm = 'mm',
}

export enum MemorySizeUnit {
  kb = 'kb',
  mb = 'mb',
  gb = 'gb',
}

export enum MemorySpeedUnit {
  mtps = 'mtps',
}

export enum MultiplierUnit {
  x = 'x',
}

export enum NumericUnit {
  million = 'million',
}

export enum PixelFillRateUnit {
  mpixelps = 'mpixelps',
  gpixelps = 'gpixelps',
}

export enum StorageUnit {
  kb = 'kb',
  mb = 'mb',
  gb = 'gb',
  tb = 'tb',
}

export enum SquareUnit {
  nm2 = 'nm2',
  um2 = 'μm2',
  mm2 = 'mm2',
}

export enum TextureFillRateUnit {
  mtexelps = 'mtexelps',
  gtexelps = 'gtexelps',
}

export enum TemperatureUnit {
  c = 'c',
  f = 'f',
}

export enum WattageUnit {
  w = 'w',
}

export enum WeightUnit {
  kg = 'kg',
}

export type MeasurementUnit =
  | BandwidthUnit
  | BitUnit
  | CurrencyUnit
  | ClockSpeedUnit
  | FlopsUnit
  | LengthUnit
  | MemorySizeUnit
  | MemorySpeedUnit
  | MultiplierUnit
  | NumericUnit
  | PixelFillRateUnit
  | SquareUnit
  | StorageUnit
  | TemperatureUnit
  | TextureFillRateUnit
  | WattageUnit
  | WeightUnit;

const BANDWIDTH_UNIT_MULTIPLIERS: Record<BandwidthUnit, number> = {
  [BandwidthUnit.kbps]: 1_000,
  [BandwidthUnit.mbps]: 1_000_000,
  [BandwidthUnit.gbps]: 1_000_000_000,
};

const BANDWIDTH_UNIT_FORMATS: Record<BandwidthUnit, string> = {
  [BandwidthUnit.kbps]: 'Kb/s',
  [BandwidthUnit.mbps]: 'Mb/s',
  [BandwidthUnit.gbps]: 'Gb/s',
};

const BIT_UNIT_MULTIPLIERS: Record<BitUnit, number> = {
  [BitUnit.bit]: 1,
};

const BIT_UNIT_FORMATS: Record<BitUnit, string> = {
  [BitUnit.bit]: 'bit',
};

const CLOCK_SPEED_UNIT_MULTIPLIERS: Record<ClockSpeedUnit, number> = {
  [ClockSpeedUnit.khz]: 1_000,
  [ClockSpeedUnit.mhz]: 1_000_000,
  [ClockSpeedUnit.ghz]: 1_000_000_000,
};

const CLOCK_SPEED_UNIT_FORMATS: Record<ClockSpeedUnit, string> = {
  [ClockSpeedUnit.khz]: 'KHz',
  [ClockSpeedUnit.mhz]: 'MHz',
  [ClockSpeedUnit.ghz]: 'GHz',
};

const CURRENCY_UNIT_FORMATS: Record<CurrencyUnit, string> = {
  [CurrencyUnit.USD]: 'USD',
};

const FLOPS_UNIT_MULTIPLIERS: Record<FlopsUnit, number> = {
  [FlopsUnit.gflops]: 1_000_000_000,
  [FlopsUnit.tflops]: 1_000_000_000_000,
};

const FLOPS_UNIT_FORMATS: Record<FlopsUnit, string> = {
  [FlopsUnit.gflops]: 'GFLOPS',
  [FlopsUnit.tflops]: 'TFLOPS',
};

const LENGTH_UNIT_MULTIPLIERS: Record<LengthUnit, number> = {
  [LengthUnit.nm]: 1,
  [LengthUnit.um]: 1_000,
  [LengthUnit.mm]: 1_000_000,
};

const LENGTH_UNIT_FORMATS: Record<LengthUnit, string> = {
  [LengthUnit.nm]: 'nm',
  [LengthUnit.um]: 'μm',
  [LengthUnit.mm]: 'mm',
};

const MEMORY_SIZE_UNIT_MULTIPLIERS: Record<MemorySizeUnit, number> = {
  [MemorySizeUnit.kb]: 1_000,
  [MemorySizeUnit.mb]: 1_000_000,
  [MemorySizeUnit.gb]: 1_000_000_000,
};

const MEMORY_SIZE_UNIT_FORMATS: Record<MemorySizeUnit, string> = {
  [MemorySizeUnit.kb]: 'KB',
  [MemorySizeUnit.mb]: 'MB',
  [MemorySizeUnit.gb]: 'GB',
};

const MEMORY_SPEED_UNIT_MULTIPLIERS: Record<MemorySpeedUnit, number> = {
  [MemorySpeedUnit.mtps]: 1_000_000,
};

const MEMORY_SPEED_UNIT_FORMATS: Record<MemorySpeedUnit, string> = {
  [MemorySpeedUnit.mtps]: 'MT/s',
};

const MULTIPLIER_MULTIPLIERS: Record<MultiplierUnit, number> = {
  [MultiplierUnit.x]: 1,
};

const MULTIPLIER_FORMATS: Record<MultiplierUnit, string> = {
  [MultiplierUnit.x]: 'x',
};

const NUMERIC_UNIT_MULTIPLIERS: Record<NumericUnit, number> = {
  [NumericUnit.million]: 1_000_000,
};

const NUMERIC_UNIT_FORMATS: Record<NumericUnit, string> = {
  [NumericUnit.million]: 'million',
};

const PIXEL_FILL_RATE_UNIT_MULTIPLIERS: Record<PixelFillRateUnit, number> = {
  [PixelFillRateUnit.mpixelps]: 1_000_000,
  [PixelFillRateUnit.gpixelps]: 1_000_000_000,
};

const PIXEL_FILL_RATE_UNIT_FORMATS: Record<PixelFillRateUnit, string> = {
  [PixelFillRateUnit.mpixelps]: 'MPixel/s',
  [PixelFillRateUnit.gpixelps]: 'GPixel/s',
};

const SQUARE_UNIT_FORMATS: Record<SquareUnit, string> = {
  [SquareUnit.nm2]: 'nm²',
  [SquareUnit.um2]: 'μm²',
  [SquareUnit.mm2]: 'mm²',
};

const SQUARE_UNIT_MULTIPLIERS: Record<SquareUnit, number> = {
  [SquareUnit.nm2]: 1,
  [SquareUnit.um2]: 1_000,
  [SquareUnit.mm2]: 1_000_000,
};

const STORAGE_UNIT_MULTIPLIERS: Record<StorageUnit, number> = {
  [StorageUnit.kb]: 1_000,
  [StorageUnit.mb]: 1_000_000,
  [StorageUnit.gb]: 1_000_000_000,
  [StorageUnit.tb]: 1_000_000_000_000,
};

const STORAGE_UNIT_FORMATS: Record<StorageUnit, string> = {
  [StorageUnit.kb]: 'KB',
  [StorageUnit.mb]: 'MB',
  [StorageUnit.gb]: 'GB',
  [StorageUnit.tb]: 'TB',
};

const TEMPERATURE_UNIT_FORMATS: Record<TemperatureUnit, string> = {
  [TemperatureUnit.c]: '°C',
  [TemperatureUnit.f]: '°F',
};

const TEMPERATURE_UNIT_MULTIPLIERS: Record<TemperatureUnit, number> = {
  [TemperatureUnit.c]: 1,
  [TemperatureUnit.f]: 1,
};

const TEXTURE_FILL_RATE_UNIT_MULTIPLIERS: Record<TextureFillRateUnit, number> =
  {
    [TextureFillRateUnit.mtexelps]: 1_000_000,
    [TextureFillRateUnit.gtexelps]: 1_000_000_000,
  };

const TEXTURE_FILL_RATE_UNIT_FORMATS: Record<TextureFillRateUnit, string> = {
  [TextureFillRateUnit.mtexelps]: 'MTexel/s',
  [TextureFillRateUnit.gtexelps]: 'GTexel/s',
};

const WATTAGE_UNIT_MULTIPLIERS: Record<WattageUnit, number> = {
  [WattageUnit.w]: 1,
};

const WATTAGE_UNIT_FORMATS: Record<WattageUnit, string> = {
  [WattageUnit.w]: 'W',
};

const WEIGHT_UNIT_MULTIPLIERS: Record<WeightUnit, number> = {
  [WeightUnit.kg]: 1_000,
};

const WEIGHT_UNIT_FORMATS: Record<WeightUnit, string> = {
  [WeightUnit.kg]: 'kg',
};

function getUnitMultiplier(unit: MeasurementUnit) {
  if (unit == null) {
    return 1;
  }

  switch (unit) {
    case BandwidthUnit.kbps:
    case BandwidthUnit.mbps:
    case BandwidthUnit.gbps:
      return BANDWIDTH_UNIT_MULTIPLIERS[unit];
    case BitUnit.bit:
      return BIT_UNIT_MULTIPLIERS[unit];
    case ClockSpeedUnit.khz:
    case ClockSpeedUnit.mhz:
    case ClockSpeedUnit.ghz:
      return CLOCK_SPEED_UNIT_MULTIPLIERS[unit];
    case FlopsUnit.gflops:
    case FlopsUnit.tflops:
      return FLOPS_UNIT_MULTIPLIERS[unit];
    case LengthUnit.nm:
    case LengthUnit.um:
    case LengthUnit.mm:
      return LENGTH_UNIT_MULTIPLIERS[unit];
    case MemorySizeUnit.kb:
    case MemorySizeUnit.mb:
    case MemorySizeUnit.gb:
      return MEMORY_SIZE_UNIT_MULTIPLIERS[unit];
    case MemorySpeedUnit.mtps:
      return MEMORY_SPEED_UNIT_MULTIPLIERS[unit];
    case MultiplierUnit.x:
      return MULTIPLIER_MULTIPLIERS[unit];
    case NumericUnit.million:
      return NUMERIC_UNIT_MULTIPLIERS[unit];
    case PixelFillRateUnit.mpixelps:
    case PixelFillRateUnit.gpixelps:
      return PIXEL_FILL_RATE_UNIT_MULTIPLIERS[unit];
    case SquareUnit.nm2:
    case SquareUnit.um2:
    case SquareUnit.mm2:
      return SQUARE_UNIT_MULTIPLIERS[unit];
    case StorageUnit.kb:
    case StorageUnit.mb:
    case StorageUnit.gb:
    case StorageUnit.tb:
      return STORAGE_UNIT_MULTIPLIERS[unit];
    case TemperatureUnit.c:
    case TemperatureUnit.f:
      return TEMPERATURE_UNIT_MULTIPLIERS[unit];
    case TextureFillRateUnit.mtexelps:
    case TextureFillRateUnit.gtexelps:
      return TEXTURE_FILL_RATE_UNIT_MULTIPLIERS[unit];
    case WattageUnit.w:
      return WATTAGE_UNIT_MULTIPLIERS[unit];
    case WeightUnit.kg:
      return WEIGHT_UNIT_MULTIPLIERS[unit];

    default:
      return 1;
  }
}

interface GetBaseUnitValueOptions {
  decimals?: number;
}

export function getBaseUnitValue(
  displayValue: number,
  unit: MeasurementUnit,
  options?: GetBaseUnitValueOptions,
) {
  if (displayValue == null) {
    return null;
  }

  const multiplier = getUnitMultiplier(unit);
  const result = displayValue * multiplier;

  const decimals = options?.decimals ?? 0;
  return Number(result.toFixed(decimals));
}

export function getDisplayUnitValue(
  baseValue: number,
  displayUnit: MeasurementUnit,
) {
  if (baseValue == null) {
    return null;
  }

  const multiplier = getUnitMultiplier(displayUnit);
  return baseValue / multiplier;
}

export function getUnitFormat(unit: MeasurementUnit) {
  if (unit == null) {
    return '';
  }

  switch (unit) {
    case BandwidthUnit.kbps:
    case BandwidthUnit.mbps:
    case BandwidthUnit.gbps:
      return BANDWIDTH_UNIT_FORMATS[unit];
    case BitUnit.bit:
      return BIT_UNIT_FORMATS[unit];
    case ClockSpeedUnit.khz:
    case ClockSpeedUnit.mhz:
    case ClockSpeedUnit.ghz:
      return CLOCK_SPEED_UNIT_FORMATS[unit];
    case CurrencyUnit.USD:
      return CURRENCY_UNIT_FORMATS[unit];
    case FlopsUnit.gflops:
    case FlopsUnit.tflops:
      return FLOPS_UNIT_FORMATS[unit];
    case LengthUnit.nm:
    case LengthUnit.um:
    case LengthUnit.mm:
      return LENGTH_UNIT_FORMATS[unit];
    case MemorySizeUnit.kb:
    case MemorySizeUnit.mb:
    case MemorySizeUnit.gb:
      return MEMORY_SIZE_UNIT_FORMATS[unit];
    case MemorySpeedUnit.mtps:
      return MEMORY_SPEED_UNIT_FORMATS[unit];
    case MultiplierUnit.x:
      return MULTIPLIER_FORMATS[unit];
    case NumericUnit.million:
      return NUMERIC_UNIT_FORMATS[unit];
    case PixelFillRateUnit.mpixelps:
    case PixelFillRateUnit.gpixelps:
      return PIXEL_FILL_RATE_UNIT_FORMATS[unit];
    case SquareUnit.mm2:
      return SQUARE_UNIT_FORMATS[unit];
    case StorageUnit.kb:
    case StorageUnit.mb:
    case StorageUnit.gb:
    case StorageUnit.tb:
      return STORAGE_UNIT_FORMATS[unit];
    case TemperatureUnit.c:
    case TemperatureUnit.f:
      return TEMPERATURE_UNIT_FORMATS[unit];
    case TextureFillRateUnit.mtexelps:
    case TextureFillRateUnit.gtexelps:
      return TEXTURE_FILL_RATE_UNIT_FORMATS[unit];
    case WattageUnit.w:
      return WATTAGE_UNIT_FORMATS[unit];
    case WeightUnit.kg:
      return WEIGHT_UNIT_FORMATS[unit];

    default:
      return '';
  }
}
