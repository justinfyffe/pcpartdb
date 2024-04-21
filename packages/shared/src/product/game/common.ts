// Types

import { Game, SettingsPresetKey } from '../../game';

export interface ProductGame {
  productId?: number;
  gameId?: number;

  // Relations
  game?: Partial<Game>;
  fps?: ProductGameFps[];
}

export interface ProductGameFps {
  productId?: number;
  gameId?: number;
  settingsPresetKey?: SettingsPresetKey;

  fps?: number;
  fpsPerDollar?: number;
  dollarsPerFrame?: number;

  metadata?: ProductGameFpsMeta;
}
export interface ProductGameFpsMeta {}
