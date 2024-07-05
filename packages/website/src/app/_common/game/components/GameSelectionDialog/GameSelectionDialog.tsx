'use client';

import { Game } from '@pcpartdb/shared';
import React, { useState } from 'react';
import { Button } from '../../../components/Button/Button';
import { ButtonVariant } from '../../../components/Button/types';
import { Dialog, DialogProps } from '../../../components/Dialog/Dialog';
import { useGameSelection } from '../../contexts/GameSelectionProvider';
import { GameOption } from '../GameSelection/GameOption';

interface GameSelectionDialogProps extends DialogProps {
  games: Partial<Game>[];
  onSelection: (game: Partial<Game>) => void;
}

export function GameSelectionDialog(props: GameSelectionDialogProps) {
  const { games, onSelection, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps}>
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
    </Dialog>
  );
}

interface GameSelectionDialogTriggerProps
  extends Omit<GameSelectionDialogProps, 'onSelection'> {
  buttonVariant?: ButtonVariant;

  className?: string;
  children?: React.ReactNode;
}

export function GameSelectionDialogTrigger(
  props: GameSelectionDialogTriggerProps,
) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const { setSelectedGame } = useGameSelection();

  return (
    <>
      <Button
        variant={props.buttonVariant ?? ButtonVariant.None}
        onClick={() => setDialogVisible(true)}
        className={props.className}
      >
        {props.children}
      </Button>

      <GameSelectionDialog
        games={props.games}
        onSelection={(game) => {
          setSelectedGame(game);
          setDialogVisible(false);
        }}
        visible={dialogVisible}
        title="Select a game to compare FPS metrics"
        showClose
        onClose={() => setDialogVisible(false)}
      />
    </>
  );
}
