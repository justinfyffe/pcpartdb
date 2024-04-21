'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Game } from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { closeDialog } from 'packages/website/src/app/_common/components/Dialog/dialog';
import React, { FunctionComponent } from 'react';
import { GameOption } from './GameOption';

interface GameSelectionDialogProps {
  games: Partial<Game>[];
  onSelection: (game: Partial<Game>) => void;
}

export const GameSelectionDialog: FunctionComponent<
  GameSelectionDialogProps
> = (props) => {
  const { games, onSelection } = props;

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] max-w-247 w-[80%] md:h-[90%] md:w-[90%] p-4 overflow-auto rounded shadow">
      <div className="flex justify-between items-center gap-2">
        <h3 className="mb-0">Select a game to compare FPS metrics</h3>
        <Button variant={ButtonVariant.None} onClick={() => closeDialog()}>
          <XMarkIcon className="w-8" />
        </Button>
      </div>

      <div className="justify-center flex flex-row flex-wrap gap-8 md:gap-6 sm:gap-4 overflow-auto">
        {games.map((game) => (
          <GameOption
            key={game.id}
            game={game}
            onClick={onSelection}
            className="flex-[0_1_30%] lg:flex-[0_1_40%]"
          />
        ))}
      </div>
    </div>
  );
};
