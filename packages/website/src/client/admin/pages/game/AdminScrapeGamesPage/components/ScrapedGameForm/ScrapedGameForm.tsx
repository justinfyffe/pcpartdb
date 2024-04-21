import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Game } from '@pcpartdb/shared';
import { GameForm } from 'packages/website/src/client/admin/components/game/GameForm/GameForm';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useCallback, useState } from 'react';

interface ScrapedGameFormProps {
  game?: Partial<Game>;
}

export const ScrapedGameForm: FunctionComponent<ScrapedGameFormProps> = (
  props,
) => {
  const { game } = props;
  const [opened, setOpened] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    setOpened(false);
    setSaved(true);
  }, []);

  return (
    <div className="border-px flex flex-col p-4 mb-4 gap-4">
      <div
        className={classNames(
          'flex flex-row gap-4',
          !saved ? 'cursor-pointer' : '',
        )}
        onClick={() => setOpened(!opened)}
      >
        {!saved && opened && <ChevronDownIcon className="w-8" />}
        {!saved && !opened && <ChevronRightIcon className="w-8" />}
        {saved && <CheckIcon className="w-8" />}

        <span className="text-xl">{game.name}</span>
      </div>

      {saved == false && (
        <GameForm
          game={game}
          className={classNames(!opened ? 'hidden' : '')}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
