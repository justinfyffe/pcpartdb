import { Game, SettingsPresetKey } from './common';

export interface GenerateGameSlugOptions {
  name?: string;
}

export function generateGameSlug(options: GenerateGameSlugOptions) {
  const { name } = options;

  const slugParts = [];
  if (name != null) {
    const nameParts = name
      .replaceAll('+', ' plus ')
      .replaceAll('&', ' and ')
      .replaceAll(/[^\s\w-]+/g, '')
      .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
      .split(' ')
      .map((value) => value.toLowerCase().trim())
      .filter((value) => value.length > 0);
    slugParts.push(...nameParts);
  }

  return slugParts.join('-');
}

export function getGameSettingsPreset(
  game: Partial<Game>,
  settingsPreset: SettingsPresetKey,
) {
  return game?.gameSettings?.presets?.[settingsPreset] ?? null;
}
