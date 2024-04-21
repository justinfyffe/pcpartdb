import { Game, SettingsPresetKey } from '../../game';
import { Product } from '../common';
import { ProductGame } from './common';

export function getProductGameFps(
  game: ProductGame,
  preset: SettingsPresetKey,
) {
  if (game == null || game.fps == null) {
    return null;
  }

  const pgf = game.fps.filter((fps) => fps.settingsPresetKey === preset);
  if (pgf.length !== 1) {
    return null;
  }

  return pgf[0];
}

export function getProductGameFpsValue(
  game: ProductGame,
  preset: SettingsPresetKey,
) {
  if (game == null || game.fps == null) {
    return null;
  }

  const pgf = game.fps.filter((fps) => fps.settingsPresetKey === preset);
  if (pgf.length !== 1) {
    return null;
  }

  return pgf[0].fps || null;
}

export function getProductGameFpsPerDollarValue(
  game: ProductGame,
  preset: SettingsPresetKey,
) {
  if (game == null || game.fps == null) {
    return null;
  }

  const pgf = game.fps.filter((fps) => fps.settingsPresetKey === preset);
  if (pgf.length !== 1) {
    return null;
  }

  return pgf[0].fpsPerDollar || null;
}

export function getProductGameCpfValue(
  game: ProductGame,
  preset: SettingsPresetKey,
) {
  if (game == null || game.fps == null) {
    return null;
  }

  const pgf = game.fps.filter((fps) => fps.settingsPresetKey === preset);
  if (pgf.length !== 1) {
    return null;
  }

  return pgf[0].dollarsPerFrame || null;
}

export function getProductGame(
  product: Partial<Product>,
  gameIdOrSlug: number | string,
) {
  if (product == null || product.games == null) {
    return null;
  }

  return (
    product.games.filter(
      (pg) => pg?.gameId === gameIdOrSlug || pg?.game?.slug === gameIdOrSlug,
    )?.[0] || null
  );
}

export function getHighestAvailableSettingsPreset(
  productGames?: Partial<ProductGame>[],
) {
  const set = new Set<SettingsPresetKey>();
  for (const productGame of productGames) {
    for (const fps of productGame?.fps ?? []) {
      set.add(fps.settingsPresetKey);
    }
  }

  if (set.has(SettingsPresetKey._4K_UHD)) {
    return SettingsPresetKey._4K_UHD;
  } else if (set.has(SettingsPresetKey.QHD)) {
    return SettingsPresetKey.QHD;
  } else if (set.has(SettingsPresetKey.Ultra)) {
    return SettingsPresetKey.Ultra;
  } else if (set.has(SettingsPresetKey.High)) {
    return SettingsPresetKey.High;
  } else if (set.has(SettingsPresetKey.Medium)) {
    return SettingsPresetKey.Medium;
  } else if (set.has(SettingsPresetKey.Low)) {
    return SettingsPresetKey.Low;
  } else {
    return null;
  }
}

export function hasSettingsPreset(
  productGames: Partial<ProductGame>[],
  settingsPreset: SettingsPresetKey,
) {
  const set = new Set<SettingsPresetKey>();
  for (const productGame of productGames) {
    for (const fps of productGame?.fps ?? []) {
      set.add(fps.settingsPresetKey);
    }
  }

  return set.has(settingsPreset);
}

export function getGamesFromProducts(products: Partial<Product>[]) {
  const allGames: Partial<Game>[] = [];
  for (const product of products) {
    allGames.push(...(product.games?.map((pg) => pg.game) ?? []));
  }
  allGames.sort((a, b) =>
    (b?.releaseDate ?? '').localeCompare(a?.releaseDate ?? ''),
  );
  const gamesMap = new Map(allGames.map((g) => [g.id, g]));
  const games = [...gamesMap.values()];
  return games;
}

export function setProductGameFps(
  originalProduct: Product,
  updatedPg: ProductGame,
  preset: SettingsPresetKey,
) {
  const originalPg = getProductGame(originalProduct, updatedPg.gameId);
  const updatedPgf = getProductGameFps(updatedPg, preset);

  // This data will be updated when we save the GPU.
  delete updatedPgf.fpsPerDollar;
  delete updatedPgf.dollarsPerFrame;

  if (!originalPg && updatedPgf) {
    // Does not have existing product game.
    // Add product game fps
    originalProduct.games.push({
      gameId: updatedPg.gameId,
      game: updatedPg.game,
      fps: [updatedPgf],
    });
  }

  if (originalPg && updatedPgf) {
    // Has product game
    // Overwrite PGF
    const idx = originalPg.fps?.findIndex(
      (pgf) => pgf.settingsPresetKey === preset,
    );
    if (idx >= 0) {
      // Existing value at this preset
      originalPg.fps[idx] = updatedPgf;
    } else {
      // No value at this preset
      originalPg.fps.push(updatedPgf);
    }
  }
}
