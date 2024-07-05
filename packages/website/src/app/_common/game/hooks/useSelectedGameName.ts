import { formatGameName, FormatGameNameOptions } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { useGameSelection } from '../contexts/GameSelectionProvider';

export function useSelectedGameName(options?: FormatGameNameOptions) {
  const { selectedGame } = useGameSelection();
  return useMemo(
    () => formatGameName(selectedGame, options),
    [selectedGame, options],
  );
}
