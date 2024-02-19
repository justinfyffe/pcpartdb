'use client';

import { createContext } from 'react';
import { AutocompleteResult } from './types';

interface AutocompleteState {
  hoveredIndex: number;
  onClick?: (result: AutocompleteResult) => void;
  onHovered?: (result: AutocompleteResult) => void;
}

export const AutocompleteContext = createContext<AutocompleteState>({
  hoveredIndex: -1,
  onClick: null,
  onHovered: null,
});
