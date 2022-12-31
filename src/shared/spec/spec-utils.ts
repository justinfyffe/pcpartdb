import Big from 'big.js';
import { Spec } from './spec-types';

export enum ClockSpeedUnit {
  KHz = 'KHz',
  MHz = 'MHz',
  GHz = 'GHz',
}

export enum StorageUnit {
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
}

export type MemoryUnit = StorageUnit;

export enum BandwidthUnit {
  Kbps = 'Kb/s',
  Mbps = 'Mb/s',
  Gbps = 'Gb/s',
}

export enum PixelFillRateUnit {
  GPixelps = 'GPixel/s',
}

export enum TextureFillRate {
  GTexelps = 'GTexel/s',
}

const clockSpeedMultiplier: Record<ClockSpeedUnit, number> = {
  [ClockSpeedUnit.KHz]: 1_000,
  [ClockSpeedUnit.MHz]: 1_000_000,
  [ClockSpeedUnit.GHz]: 1_000_000_000,
};

const storageMultiplier: Record<StorageUnit, number> = {
  [StorageUnit.KB]: 1_000,
  [StorageUnit.MB]: 1_000_000,
  [StorageUnit.GB]: 1_000_000_000,
  [StorageUnit.TB]: 1_000_000_000_000,
};

const bandwidthMultiplier: Record<BandwidthUnit, number> = {
  [BandwidthUnit.Kbps]: 1_000,
  [BandwidthUnit.Mbps]: 1_000_000,
  [BandwidthUnit.Gbps]: 1_000_000_000,
};

const pixelFillRate: Record<PixelFillRateUnit, number> = {
  [PixelFillRateUnit.GPixelps]: 1_000_000_000,
};

const textureFillRate: Record<TextureFillRate, number> = {
  [TextureFillRate.GTexelps]: 1_000_000_000,
};

function specValueMultiplier(spec: Spec) {
  const { metadata } = spec;

  if (metadata?.unit == null) {
    return 1;
  }

  const { unit } = metadata;

  switch (unit) {
    case ClockSpeedUnit.KHz:
    case ClockSpeedUnit.MHz:
    case ClockSpeedUnit.GHz:
      return clockSpeedMultiplier[unit];
    case StorageUnit.KB:
    case StorageUnit.MB:
    case StorageUnit.GB:
    case StorageUnit.TB:
      return storageMultiplier[unit];
    case BandwidthUnit.Kbps:
    case BandwidthUnit.Mbps:
    case BandwidthUnit.Gbps:
      return bandwidthMultiplier[unit];
    case PixelFillRateUnit.GPixelps:
      return pixelFillRate[unit];
    case TextureFillRate.GTexelps:
      return textureFillRate[unit];
    default:
      return 1;
  }
}

export function hasSpec(spec: Spec) {
  return spec?.value != null;
}

export function compareSpecs(spec1: Spec, spec2: Spec) {
  // Handle edge cases (missing specs)
  if (!hasSpec(spec1) && !hasSpec(spec2)) {
    return 0;
  } else if (!hasSpec(spec1)) {
    return -1;
  } else if (!hasSpec(spec2)) {
    return 1;
  }

  // Check unsupported types
  if (spec1.metadata?.specKey !== spec2.metadata?.specKey) {
    throw new Error('Cannot compare different specs');
  }

  if (typeof spec1.value !== typeof spec2.value) {
    throw new Error('Cannot compare specs of different values');
  }

  // Handle text-based comparisons
  if (typeof spec1.value === 'string' && typeof spec2.value === 'string') {
    return spec1.value.localeCompare(spec2.value);
  }

  // Handle numberic-based comparisons
  if (typeof spec1.value === 'number' && typeof spec2.value === 'number') {
    const value1 = Big(spec1.value).mul(specValueMultiplier(spec1));
    const value2 = Big(spec2.value).mul(specValueMultiplier(spec2));

    return value1.cmp(value2);
  }

  throw new Error(`Cannot compare specs of type '${typeof spec1.value}'`);
}
