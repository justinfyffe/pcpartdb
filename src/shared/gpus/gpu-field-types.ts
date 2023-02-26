import Joi from '@hapi/joi';
import { GpuDataSourceKey } from './gpu-types';

export interface GpuFieldMeta {
  fieldKey?: string;
  currency?: string;
  unit?: GpuFieldUnit;
  dataSource?: GpuFieldDataSource;
}

export interface GpuFieldDataSource {
  source?: GpuDataSourceKey;
  enabled?: boolean;
}

export interface GpuField<T = unknown> {
  value?: T;
  meta?: GpuFieldMeta;
}

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

export enum MemoryUnit {
  kb = 'kb',
  mb = 'mb',
  gb = 'gb',
}

export enum NumericUnit {
  million = 'million',
}

export enum PixelFillRateUnit {
  gpixelps = 'gpixelps',
}

export enum StorageUnit {
  kb = 'kb',
  mb = 'mb',
  gb = 'gb',
  tb = 'tb',
}

export enum TextureFillRateUnit {
  gtexelps = 'gtexelps',
}

export enum WattageUnit {
  w = 'w',
}

export enum WeightUnit {
  kg = 'kg',
}

export type GpuFieldUnit =
  | BandwidthUnit
  | BitUnit
  | CurrencyUnit
  | ClockSpeedUnit
  | FlopsUnit
  | LengthUnit
  | MemoryUnit
  | NumericUnit
  | PixelFillRateUnit
  | StorageUnit
  | TextureFillRateUnit
  | WattageUnit
  | WeightUnit;

export const gpuFieldValidator = Joi.object({
  value: Joi.any().allow(null),
  meta: Joi.any().allow(null),
}).options({ abortEarly: false });
