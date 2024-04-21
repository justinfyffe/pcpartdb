import { ProductGame } from '@pcpartdb/shared';
import { Checkbox } from 'packages/website/src/client/shared/components/Checkbox/Checkbox';
import {
  Td,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ScrapeProductContext } from './ScrapeProductContext';

interface ScrapedGameRowProps {
  gameId: string;
}

export const ScrapedGameRow: FunctionComponent<ScrapedGameRowProps> = (
  props,
) => {
  const gameId = `${props.gameId}`;

  const context = useContext(ScrapeProductContext);
  const games = context.data.games;
  const game = games[gameId]?.value as ProductGame;

  const emptyValue = useMemo(() => getEmptyValue(gameId), [gameId]);
  const label = game?.game?.name;

  const values = useMemo(() => {
    const fps = game?.fps?.map((val) => `${val.settingsPresetKey}: ${val.fps}`);
    return `${fps.join(', ') ?? '--'}`;
  }, [game?.fps]);

  const [checked, setChecked] = useState(() => false);

  useEffect(() => {
    if (game?.fps == null || game.fps.length === 0) {
      games[gameId] = { value: emptyValue, enabled: false };
      setChecked(false);
    } else {
      setChecked(games[gameId].enabled);
    }
  }, [emptyValue, game.fps, games, gameId]);

  const handleClick = useCallback(() => {
    const gameData = games[gameId];
    gameData.enabled = !checked;

    setChecked(!checked);
  }, [games, gameId, checked]);

  return (
    <Tr onClick={handleClick} className="hover:bg-mouse-hover cursor-pointer">
      <Td>{label}</Td>
      <Td colSpan={2}>{values}</Td>
      <Td className="text-right">
        <Checkbox value={games?.[gameId]?.enabled ?? false} />
      </Td>
    </Tr>
  );
};

function getEmptyValue(gameId: string): ProductGame {
  return { gameId: Number(gameId), fps: [] };
}
