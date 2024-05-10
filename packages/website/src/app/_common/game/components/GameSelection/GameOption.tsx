'use client';

import { Game } from '@pcpartdb/shared';
import React, { useCallback } from 'react';
import { classNames } from '../../../utils/classNames';
import { gameListingImagePath } from '../../../utils/gameListingImagePath';
import { useGameSelection } from '../../contexts/GameSelectionProvider';

export interface GameOptionProps {
  game?: Partial<Game>;
  autoSelect?: boolean;
  dimmable?: boolean;
  onClick?: (game: Partial<Game>) => void;
  className?: string;
}

export function GameOption(props: GameOptionProps) {
  const { autoSelect, dimmable, game, onClick } = props;

  const { selectedGame, setSelectedGame } = useGameSelection();

  const handleOptionClick = useCallback(() => {
    if (autoSelect) {
      setSelectedGame(game);
    }
    onClick?.(game);
  }, [autoSelect, game, onClick, setSelectedGame]);

  return (
    <div
      className={classNames(
        'flex flex-col gap-1 items-center p-1 cursor-pointer',
        selectedGame?.id === game?.id ? 'outline-dotted outline-1' : '',
        props.className,
      )}
      onClick={handleOptionClick}
    >
      <img
        loading="lazy"
        src={gameListingImagePath(game)}
        className={classNames(
          'aspect-video max-h-35.25',
          selectedGame?.id !== game?.id && dimmable
            ? 'opacity-50 hover:opacity-100 transition-opacity'
            : '',
        )}
      />
      <div className="flex flex-col items-center text-center justify-center">
        <span className="font-medium">{game?.nameShort || game?.name}</span>
      </div>
    </div>
  );
}
