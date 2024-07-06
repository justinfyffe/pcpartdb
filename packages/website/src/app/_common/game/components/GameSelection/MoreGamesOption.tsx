'use client';

import { Game } from '@pcpartdb/shared';
import { getGameListingImage } from 'packages/website/src/client/image/utils';
import React from 'react';
import { ButtonVariant } from '../../../components/Button/types';
import { classNames } from '../../../utils/classNames';
import { GameSelectionDialogTrigger } from '../GameSelectionDialog/GameSelectionDialog';

export interface MoreGamesOptionProps {
  games: Partial<Game>[];
  className?: string;
}

export function MoreGamesOption(props: MoreGamesOptionProps) {
  const { games } = props;

  return (
    <GameSelectionDialogTrigger
      games={games}
      buttonVariant={ButtonVariant.None}
      className={classNames('px-0 py-0', props.className)}
    >
      <div
        className={classNames(
          'flex flex-col gap-1 items-center p-1 cursor-pointer',
        )}
      >
        <img
          loading="lazy"
          src={getGameListingImage(null)}
          alt="More games to choose from"
          className="aspect-video w-full h-full max-h-35.25 opacity-50 hover:opacity-100 transition-opacity"
        />
        <div className="flex flex-col items-center text-center justify-center">
          <span className="font-medium">More Games</span>
        </div>
      </div>
    </GameSelectionDialogTrigger>
  );
}
