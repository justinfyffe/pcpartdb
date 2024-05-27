'use client';

import { Game } from '@pcpartdb/shared';
import React, { useEffect, useMemo, useState } from 'react';
import useWindowDimensions from '../../../hooks/browser/useWindowDimensions';
import { useGameSelection } from '../../contexts/GameSelectionProvider';
import { GameOption } from './GameOption';
import { MoreGamesOption } from './MoreGamesOption';

const DEFAULT_LIMIT = 7;

export interface GameSelectionCarouselProps {
  games?: Partial<Game>[];
}

export function GameSelectionCarousel(props: GameSelectionCarouselProps) {
  const { games } = props;
  const { selectedGame } = useGameSelection();
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [lastGame, setLastGame] = useState(() => {
    if (games.findIndex((game) => game?.id === selectedGame?.id) >= limit - 1) {
      return selectedGame;
    } else {
      return games[limit - 1] || null;
    }
  });

  const windowDimensions = useWindowDimensions();
  useEffect(() => {
    // Must be done in an effect so it's only on the client.
    // For hydration consistency purposes.
    if (windowDimensions.width < 768) {
      setLimit(3);
    } else if (windowDimensions.width < 1024) {
      setLimit(5);
    } else {
      setLimit(DEFAULT_LIMIT);
    }
  }, [windowDimensions.width]);

  // Construct priority list:
  // Ordered by release date.
  // If a game is selected that is not in the <limit>. Then the last one
  // is removed, and the selected is pushed on.
  const priority = useMemo(() => {
    const list = games.slice(0, limit - 1);
    if (lastGame != null) {
      list.push(lastGame);
    }
    return list;
  }, [games, lastGame, limit]);

  useEffect(() => {
    if (games.findIndex((game) => game?.id === selectedGame?.id) >= limit - 1) {
      setLastGame(selectedGame);
    }
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
