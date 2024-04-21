import { Game, getAdminEditGamePath } from '@pcpartdb/shared';
import {
  getImagePath,
  getPlaceholderGameImage,
} from 'packages/website/src/client/image/utils';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { AdminListGamesContext } from '../../context/AdminListGamesContext';

interface GamesListProps {
  //
}

export const GamesList: FunctionComponent<GamesListProps> = (_props) => {
  const { games } = useContext(AdminListGamesContext);

  return (
    <section className="flex flex-wrap flex-rol gap-8">
      {games.map((game) => (
        <GameItem key={game.id} game={game} />
      ))}
    </section>
  );
};

interface GameItemProps {
  game: Game;
}

export function GameItem(props: GameItemProps) {
  const { game } = props;

  const hasImage = game.listingImage != null;
  const listingImage = game.listingImage;
  const placeholderImage = getPlaceholderGameImage();
  const name = game.nameShort || game.name;
  const releaseDate = game.releaseDate;

  return (
    <a
      href={getAdminEditGamePath(game)}
      className="flex flex-col gap-1 items-center p-1 cursor-pointer"
    >
      <img
        src={hasImage ? getImagePath(listingImage) : placeholderImage}
        className="h-35.25"
      />
      <div className="flex flex-col items-center">
        <span className="font-medium">{name}</span>
        <span className="text-sm">{releaseDate}</span>
      </div>
    </a>
  );
}
