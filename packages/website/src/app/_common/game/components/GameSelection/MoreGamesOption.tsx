'use client';

import { Game } from '@pcpartdb/shared';
import { getGameListingImage } from 'packages/website/src/client/image/utils';
import React, { useCallback } from 'react';
import { closeDialog, showDialog } from '../../../components/Dialog/dialog';
import { classNames } from '../../../utils/classNames';
import { useGameSelection } from '../../contexts/GameSelectionProvider';
import { GameSelectionDialog } from './GameSelectionDialog';

export interface MoreGamesOptionProps {
  games: Partial<Game>[];
  className?: string;
}

export function MoreGamesOption(props: MoreGamesOptionProps) {
  const { games } = props;
  const { setSelectedGame } = useGameSelection();

  const handleClick = useCallback(() => {
    showDialog(
      <GameSelectionDialog
        games={games}
        onSelection={(pg) => {
          setSelectedGame(pg);
          closeDialog();
        }}
      />,
    );
  }, [games, setSelectedGame]);

  return (
    <div
      className={classNames(
        'flex flex-col gap-1 items-center p-1 cursor-pointer',
        props.className,
      )}
      onClick={handleClick}
    >
      <img
        src={getGameListingImage(null)}
        className="aspect-video w-full h-full max-h-35.25 opacity-50 hover:opacity-100 transition-opacity"
      />
      <div className="flex flex-col items-center text-center justify-center">
        <span className="font-medium">More Games</span>
      </div>
    </div>
  );
}
