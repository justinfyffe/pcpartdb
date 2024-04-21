// Enums

import { schema } from 'normalizr';
import { Image } from '../image';
import { CpuProduct, GpuProduct, ProductGame } from '../product';

export enum SettingsPresetKey {
  Low = 'SETTINGS_LOW',
  Medium = 'SETTINGS_MEDIUM',
  High = 'SETTINGS_HIGH',
  Ultra = 'SETTINGS_ULTRA',
  QHD = 'SETTINGS_QHD',
  _4K_UHD = 'SETTINGS_4K_UHD',
}

// Consts

export const SETTINGS_PRESETS_ORDER = [
  SettingsPresetKey.Low,
  SettingsPresetKey.Medium,
  SettingsPresetKey.High,
  SettingsPresetKey.Ultra,
  SettingsPresetKey.QHD,
  SettingsPresetKey._4K_UHD,
];

// Types

export interface Game {
  id?: number;

  name: string;
  slug: string;

  nameShort?: string;
  description?: string;
  publisher?: string;
  developer?: string;
  releaseDate?: string;
  affiliateUrl?: string;

  gameSettings?: GameSettings;
  scraperOptions?: GameScraperOptions;

  minimumRequirements?: GameRequirements;
  recommendedRequirements?: GameRequirements;

  minimumGpuId?: number;
  recommendedGpuId?: number;
  minimumCpuId?: number;
  recommendedCpuId?: number;

  listingImageId?: number;

  metadata?: GameMeta;

  listingImage?: Partial<Image>;
  minimumCpu?: Partial<CpuProduct>;
  recommendedCpu?: Partial<CpuProduct>;
  minimumGpu?: Partial<GpuProduct>;
  recommendedGpu?: Partial<GpuProduct>;
}

export interface GameMeta {
  //
}

export interface GameRequirements {
  //
}

export interface GameSettings {
  presets?: Partial<Record<SettingsPresetKey, GameSettingsPreset>>;
}

export interface GameSettingsPreset {
  name?: string;
  nameShort?: string;
}

export interface GameScraperOptions {
  notebookCheckName?: string;
}
