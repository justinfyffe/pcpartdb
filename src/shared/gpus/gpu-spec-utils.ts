import {
  BandwidthUnit,
  BitUnit,
  ClockSpeedUnit,
  FlopsUnit,
  GpuSpecUnit,
  LengthUnit,
  MemoryUnit,
  NumericUnit,
  PixelFillRateUnit,
  StorageUnit,
  TextureFillRateUnit,
  WattageUnit,
  WeightUnit,
} from './gpu-spec-types';

const bandwidthMultiplier: Record<BandwidthUnit, number> = {
  [BandwidthUnit.Kbps]: 1_000,
  [BandwidthUnit.Mbps]: 1_000_000,
  [BandwidthUnit.Gbps]: 1_000_000_000,
};

const bitMultiplier: Record<BitUnit, number> = {
  [BitUnit.bit]: 1,
};

const clockSpeedMultiplier: Record<ClockSpeedUnit, number> = {
  [ClockSpeedUnit.KHz]: 1_000,
  [ClockSpeedUnit.MHz]: 1_000_000,
  [ClockSpeedUnit.GHz]: 1_000_000_000,
};

const flopsMultiplier: Record<FlopsUnit, number> = {
  [FlopsUnit.GFLOPS]: 1_000_000_000,
  [FlopsUnit.TFLOPS]: 1_000_000_000_000,
};

const lengthMultiplier: Record<LengthUnit, number> = {
  [LengthUnit.nm]: 1,
  [LengthUnit.um]: 1_000,
  [LengthUnit.mm]: 1_000_000,
};

const memoryMultiplier: Record<MemoryUnit, number> = {
  [MemoryUnit.KB]: 1_000,
  [MemoryUnit.MB]: 1_000_000,
  [MemoryUnit.GB]: 1_000_000_000,
};

const numericMultiplier: Record<NumericUnit, number> = {
  [NumericUnit.million]: 1_000_000,
};

const pixelFillRateMultiplier: Record<PixelFillRateUnit, number> = {
  [PixelFillRateUnit.GPixelps]: 1_000_000_000,
};

const storageMultiplier: Record<StorageUnit, number> = {
  [StorageUnit.KB]: 1_000,
  [StorageUnit.MB]: 1_000_000,
  [StorageUnit.GB]: 1_000_000_000,
  [StorageUnit.TB]: 1_000_000_000_000,
};

const textureFillRateMultiplier: Record<TextureFillRateUnit, number> = {
  [TextureFillRateUnit.GTexelps]: 1_000_000_000,
};

const wattageMultiplier: Record<WattageUnit, number> = {
  [WattageUnit.W]: 1,
};

const weightMultiplier: Record<WeightUnit, number> = {
  [WeightUnit.kg]: 1_000,
};

export function getBaseGpuSpecValue(
  displayValue: number,
  displayUnit: GpuSpecUnit,
) {
  const multiplier = getGpuSpecValueMultiplier(displayUnit);
  return displayValue * multiplier;
}

export function getDisplayGpuSpecValue(
  baseValue: number,
  displayUnit: GpuSpecUnit,
) {
  const multiplier = getGpuSpecValueMultiplier(displayUnit);
  return baseValue / multiplier;
}

function getGpuSpecValueMultiplier(unit: GpuSpecUnit) {
  if (unit == null) {
    return 1;
  }

  switch (unit) {
    case BandwidthUnit.Kbps:
    case BandwidthUnit.Mbps:
    case BandwidthUnit.Gbps:
      return bandwidthMultiplier[unit];
    case BitUnit.bit:
      return bitMultiplier[unit];
    case ClockSpeedUnit.KHz:
    case ClockSpeedUnit.MHz:
    case ClockSpeedUnit.GHz:
      return clockSpeedMultiplier[unit];
    case FlopsUnit.GFLOPS:
    case FlopsUnit.TFLOPS:
      return flopsMultiplier[unit];
    case LengthUnit.nm:
    case LengthUnit.um:
    case LengthUnit.mm:
      return lengthMultiplier[unit];
    case MemoryUnit.KB:
    case MemoryUnit.MB:
    case MemoryUnit.GB:
      return memoryMultiplier[unit];
    case NumericUnit.million:
      return numericMultiplier[unit];
    case PixelFillRateUnit.GPixelps:
      return pixelFillRateMultiplier[unit];
    case StorageUnit.KB:
    case StorageUnit.MB:
    case StorageUnit.GB:
    case StorageUnit.TB:
      return storageMultiplier[unit];
    case TextureFillRateUnit.GTexelps:
      return textureFillRateMultiplier[unit];
    case WattageUnit.W:
      return wattageMultiplier[unit];
    case WeightUnit.kg:
      return weightMultiplier[unit];
    default:
      return 1;
  }
}
