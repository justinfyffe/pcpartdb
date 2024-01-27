import { ProductType } from '../common';
import { CPU_FIELD_LABELS, CpuFieldKey, CpuFields } from './cpu';
import { GPU_FIELD_LABELS, GpuFieldKey, GpuFields } from './gpu';

// Enums

export enum MarketSegment {
  Desktop = 'DESKTOP',
  Embedded = 'EMBEDDED',
  Integrated = 'INTEGRATED',
  Mobile = 'MOBILE',
  Server = 'SERVER',
  Workstation = 'WORKSTATION',
}

export enum ProductionStatus {
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
  Unreleased = 'UNRELEASED',
}

// Types

export type ProductFieldKey = CpuFieldKey | GpuFieldKey;
export type ProductFields = Partial<Record<ProductFieldKey, any>>;

export interface ProductFieldMeta {
  formattedValue?: string;
  autoUpdate?: boolean;
  fieldKey?: ProductFieldKey;
  fieldLabel?: string;
}

export interface ProductField<T = unknown> {
  value?: T;
  meta?: ProductFieldMeta;
}

// Consts

export const PRODUCT_FIELD_LABELS: Partial<
  Record<ProductType, Record<string, string>>
> = {
  [ProductType.Cpu]: CPU_FIELD_LABELS,
  [ProductType.Gpu]: GPU_FIELD_LABELS,
};
