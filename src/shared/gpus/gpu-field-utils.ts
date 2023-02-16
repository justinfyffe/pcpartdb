import {
  BandwidthUnit,
  BitUnit,
  ClockSpeedUnit,
  FlopsUnit,
  GpuFieldUnit,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  StorageUnit,
  TextureFillRateUnit,
  WattageUnit,
  WeightUnit,
} from './gpu-field-types';

const bandwidthMultiplier: Record<BandwidthUnit, number> = {
  [BandwidthUnit.kbps]: 1_000,
  [BandwidthUnit.mbps]: 1_000_000,
  [BandwidthUnit.gbps]: 1_000_000_000,
};

const bandwidthFormats: Record<BandwidthUnit, string> = {
  [BandwidthUnit.kbps]: 'Kb/s',
  [BandwidthUnit.mbps]: 'Mb/s',
  [BandwidthUnit.gbps]: 'Gb/s',
};

const bitMultiplier: Record<BitUnit, number> = {
  [BitUnit.bit]: 1,
};

const bitFormats: Record<BitUnit, string> = {
  [BitUnit.bit]: 'bit',
};

const clockSpeedMultiplier: Record<ClockSpeedUnit, number> = {
  [ClockSpeedUnit.khz]: 1_000,
  [ClockSpeedUnit.mhz]: 1_000_000,
  [ClockSpeedUnit.ghz]: 1_000_000_000,
};

const clockSpeedFormats: Record<ClockSpeedUnit, string> = {
  [ClockSpeedUnit.khz]: 'KHz',
  [ClockSpeedUnit.mhz]: 'MHz',
  [ClockSpeedUnit.ghz]: 'GHz',
};

const flopsMultiplier: Record<FlopsUnit, number> = {
  [FlopsUnit.gflops]: 1_000_000_000,
  [FlopsUnit.tflops]: 1_000_000_000_000,
};

const flopsFormats: Record<FlopsUnit, string> = {
  [FlopsUnit.gflops]: 'GFLOPS',
  [FlopsUnit.tflops]: 'TFLOPS',
};

const lengthMultiplier: Record<LengthUnit, number> = {
  [LengthUnit.nm]: 1,
  [LengthUnit.um]: 1_000,
  [LengthUnit.mm]: 1_000_000,
};

const lengthFormats: Record<LengthUnit, string> = {
  [LengthUnit.nm]: 'nm',
  [LengthUnit.um]: 'μm',
  [LengthUnit.mm]: 'mm',
};

const memoryMultiplier: Record<MemoryUnit, number> = {
  [MemoryUnit.kb]: 1_000,
  [MemoryUnit.mb]: 1_000_000,
  [MemoryUnit.gb]: 1_000_000_000,
};

const memoryFormats: Record<MemoryUnit, string> = {
  [MemoryUnit.kb]: 'kb',
  [MemoryUnit.mb]: 'mb',
  [MemoryUnit.gb]: 'gb',
};

const numericMultiplier: Record<NumericUnit, number> = {
  [NumericUnit.million]: 1_000_000,
};

const numericFormats: Record<NumericUnit, string> = {
  [NumericUnit.million]: 'million',
};

const pixelFillRateMultiplier: Record<PixelFillRateUnit, number> = {
  [PixelFillRateUnit.gpixelps]: 1_000_000_000,
};

const pixelFillRateFormats: Record<PixelFillRateUnit, string> = {
  [PixelFillRateUnit.gpixelps]: 'GPixel/s',
};

const storageMultiplier: Record<StorageUnit, number> = {
  [StorageUnit.kb]: 1_000,
  [StorageUnit.mb]: 1_000_000,
  [StorageUnit.gb]: 1_000_000_000,
  [StorageUnit.tb]: 1_000_000_000_000,
};

const storageFormats: Record<StorageUnit, string> = {
  [StorageUnit.kb]: 'KB',
  [StorageUnit.mb]: 'MB',
  [StorageUnit.gb]: 'GB',
  [StorageUnit.tb]: 'TB',
};

const textureFillRateMultiplier: Record<TextureFillRateUnit, number> = {
  [TextureFillRateUnit.gtexelps]: 1_000_000_000,
};

const textureFillRateFormats: Record<TextureFillRateUnit, string> = {
  [TextureFillRateUnit.gtexelps]: 'GTexel/s',
};

const wattageMultiplier: Record<WattageUnit, number> = {
  [WattageUnit.w]: 1,
};

const wattageFormats: Record<WattageUnit, string> = {
  [WattageUnit.w]: 'W',
};

const weightMultiplier: Record<WeightUnit, number> = {
  [WeightUnit.kg]: 1_000,
};

const weightFormats: Record<WeightUnit, string> = {
  [WeightUnit.kg]: 'kg',
};

function getGpuFieldValueMultiplier(unit: GpuFieldUnit) {
  if (unit == null) {
    return 1;
  }

  switch (unit) {
    case BandwidthUnit.kbps:
    case BandwidthUnit.mbps:
    case BandwidthUnit.gbps:
      return bandwidthMultiplier[unit];
    case BitUnit.bit:
      return bitMultiplier[unit];
    case ClockSpeedUnit.khz:
    case ClockSpeedUnit.mhz:
    case ClockSpeedUnit.ghz:
      return clockSpeedMultiplier[unit];
    case FlopsUnit.gflops:
    case FlopsUnit.tflops:
      return flopsMultiplier[unit];
    case LengthUnit.nm:
    case LengthUnit.um:
    case LengthUnit.mm:
      return lengthMultiplier[unit];
    case MemoryUnit.kb:
    case MemoryUnit.mb:
    case MemoryUnit.gb:
      return memoryMultiplier[unit];
    case NumericUnit.million:
      return numericMultiplier[unit];
    case PixelFillRateUnit.gpixelps:
      return pixelFillRateMultiplier[unit];
    case StorageUnit.kb:
    case StorageUnit.mb:
    case StorageUnit.gb:
    case StorageUnit.tb:
      return storageMultiplier[unit];
    case TextureFillRateUnit.gtexelps:
      return textureFillRateMultiplier[unit];
    case WattageUnit.w:
      return wattageMultiplier[unit];
    case WeightUnit.kg:
      return weightMultiplier[unit];

    default:
      return 1;
  }
}

export function calculateBaseGpuFieldValue(
  displayValue: number,
  unit: GpuFieldUnit,
) {
  const multiplier = getGpuFieldValueMultiplier(unit);
  return displayValue * multiplier;
}

export function calculateDisplayGpuFieldValue(
  baseValue: number,
  unit: GpuFieldUnit,
) {
  const multiplier = getGpuFieldValueMultiplier(unit);
  return baseValue / multiplier;
}

export function getUnitFormat(unit: GpuFieldUnit) {
  if (unit == null) {
    return '';
  }

  switch (unit) {
    case BandwidthUnit.kbps:
    case BandwidthUnit.mbps:
    case BandwidthUnit.gbps:
      return bandwidthFormats[unit];
    case BitUnit.bit:
      return bitFormats[unit];
    case ClockSpeedUnit.khz:
    case ClockSpeedUnit.mhz:
    case ClockSpeedUnit.ghz:
      return clockSpeedFormats[unit];
    case FlopsUnit.gflops:
    case FlopsUnit.tflops:
      return flopsFormats[unit];
    case LengthUnit.nm:
    case LengthUnit.um:
    case LengthUnit.mm:
      return lengthFormats[unit];
    case MemoryUnit.kb:
    case MemoryUnit.mb:
    case MemoryUnit.gb:
      return memoryFormats[unit];
    case NumericUnit.million:
      return numericFormats[unit];
    case PixelFillRateUnit.gpixelps:
      return pixelFillRateFormats[unit];
    case StorageUnit.kb:
    case StorageUnit.mb:
    case StorageUnit.gb:
    case StorageUnit.tb:
      return storageFormats[unit];
    case TextureFillRateUnit.gtexelps:
      return textureFillRateFormats[unit];
    case WattageUnit.w:
      return wattageFormats[unit];
    case WeightUnit.kg:
      return weightFormats[unit];

    default:
      return '';
  }
}
