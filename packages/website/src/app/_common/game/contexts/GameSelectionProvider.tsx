'use client';

import { Game, Product } from '@pcpartdb/shared';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SettingsPresetSelectionProvider } from './SettingsPresetSelectionProvider';

export interface GameSelectionContextState {
  selectedGame: Partial<Game>;
  setSelectedGame: (game: Partial<Game>) => void;
}

export const GameSelectionContext = createContext<GameSelectionContextState>({
  selectedGame: null,
  setSelectedGame: null,
});

export function useGameSelection() {
  return useContext(GameSelectionContext);
}

export interface GameSelectionProviderProps {
  products: Partial<Product>[];
  game?: Partial<Game>;
  children: React.ReactNode;
}

export function GameSelectionProvider(props: GameSelectionProviderProps) {
  const [selectedGame, setSelectedGame] = useState(props.game ?? null);
  const [skipUrlUpdate, setSkipUrlUpdate] = useState(true);

  useEffect(() => {
    // Don't update url on first load
    if (skipUrlUpdate) {
      setSkipUrlUpdate(false);
      return;
    }

    const url = new URL(window.location.href);
    if (selectedGame?.slug != null) {
      url.searchParams.set('game', selectedGame?.slug);
    } else {
      url.searchParams.delete('game');
    }

    window.history.replaceState({}, '', url);
    // Only update when game changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  return (
    <GameSelectionContext.Provider value={{ selectedGame, setSelectedGame }}>
      <SettingsPresetSelectionProvider products={props.products}>
        {props.children}
      </SettingsPresetSelectionProvider>
    </GameSelectionContext.Provider>
  );
}
