'use client';

import { Game } from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { useGameSelection } from '../../contexts/GameSelectionProvider';
import { GameOption } from './GameOption';
import { MoreGamesOption } from './MoreGamesOption';

export interface GameSelectionCarouselProps {
  games?: Partial<Game>[];
}

export function GameSelectionCarousel(props: GameSelectionCarouselProps) {
  const { games } = props;
  const { selectedGame } = useGameSelection();

  const windowDimensions = useWindowDimensions();
  const limit = useMemo(() => {
    const defaultLimit = 7;
    if (!windowDimensions.width || !windowDimensions.height) {
      return defaultLimit;
    }

    if (windowDimensions.width < 768) {
      return 3;
    }

    if (windowDimensions.width < 1024) {
      return 5;
    }

    return defaultLimit;
  }, [windowDimensions.height, windowDimensions.width]);

  // Construct priority list:
  // Ordered by release date.
  // If a game is selected that is not in the <limit>. Then the last one
  // is removed, and the selected is pushed on.
  const priority = useMemo(() => {
    const list = games.slice(0, limit);
    if (games.findIndex((game) => game?.id === selectedGame?.id) >= limit) {
      list.pop();
      list.push(selectedGame);
    }
    return list;
  }, [games, limit, selectedGame]);

  if (!games) {
    return <></>;
  }

  return (
    <div className="justify-center flex flex-row flex-wrap gap-8 md:gap-6 sm:gap-4">
      {priority.map((game) => (
        <GameOption
          key={game.id}
          game={game}
          autoSelect
          dimmable
          className="flex-[0_1_20%] lg:flex-[0_1_30%] md:flex-[0_1_40%] "
        />
      ))}

      {/* More Games Dialog Option */}
      {games.length > limit && (
        <MoreGamesOption
          games={games}
          className="flex-[0_1_20%] lg:flex-[0_1_30%] md:flex-[0_1_40%]"
        />
      )}
    </div>
  );
}
