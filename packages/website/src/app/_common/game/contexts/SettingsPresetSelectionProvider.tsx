'use client';

import {
  getHighestAvailableSettingsPreset,
  getProductGame,
  hasSettingsPreset,
  Product,
  SETTINGS_PRESETS_ORDER,
  SettingsPresetKey,
} from '@pcpartdb/shared';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useGameSelection } from './GameSelectionProvider';

export interface SettingsPresetSelectionContextState {
  settingsPreset: SettingsPresetKey;
  nextSettingsPreset: () => SettingsPresetKey;
}

export const SettingsPresetSelectionContext =
  createContext<SettingsPresetSelectionContextState>({
    settingsPreset: null,
    nextSettingsPreset: null,
  });

export function useSettingsPresetSelection() {
  return useContext(SettingsPresetSelectionContext);
}

export interface SettingsPresetSelectionProviderProps {
  products: Partial<Product>[];
  children: React.ReactNode;
}

export function SettingsPresetSelectionProvider(
  props: SettingsPresetSelectionProviderProps,
) {
  const { products } = props;
  const { selectedGame: game } = useGameSelection();
  const productGames = useMemo(
    () => products.map((p) => getProductGame(p, game?.id)),
    [products, game?.id],
  );

  const [settingsPreset, setSettingsPreset] = useState(() =>
    getHighestAvailableSettingsPreset(productGames),
  );

  const nextSettingsPreset = useCallback(() => {
    const currentIdx = SETTINGS_PRESETS_ORDER.indexOf(settingsPreset);
    let nextIdx = currentIdx;
    do {
      nextIdx = nextIdx - 1;
      if (hasSettingsPreset(productGames, SETTINGS_PRESETS_ORDER[nextIdx])) {
        break;
      }
    } while (nextIdx >= 0);

    if (nextIdx < 0) {
      nextIdx = SETTINGS_PRESETS_ORDER.indexOf(
        getHighestAvailableSettingsPreset(productGames),
      );
    }

    const nextPreset = SETTINGS_PRESETS_ORDER[nextIdx];
    setSettingsPreset(nextPreset);
    return nextPreset;
  }, [productGames, settingsPreset]);

  useEffect(() => {
    const preset = getHighestAvailableSettingsPreset(productGames);
    setSettingsPreset(preset);
  }, [productGames]);

  return (
    <SettingsPresetSelectionContext.Provider
      value={{ settingsPreset, nextSettingsPreset }}
    >
      {props.children}
    </SettingsPresetSelectionContext.Provider>
  );
}
