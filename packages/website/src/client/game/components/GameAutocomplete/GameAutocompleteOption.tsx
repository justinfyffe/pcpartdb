import { Game } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { getGameListingImage } from '../../../image/utils';
import { AutocompleteOption } from '../../../shared/components/Autocomplete/AutocompleteOption';
import { Img } from '../../../shared/components/Img/Img';

interface GameAutocompleteOptionProps {
  index: number;
  game: Game;
}

export const GameAutocompleteOption: FunctionComponent<
  GameAutocompleteOptionProps
> = (props) => {
  const { index, game } = props;

  const id = game.id;
  const name = game.name;
  const image = getGameListingImage(game);
  const releaseDate = game.releaseDate;

  return (
    <AutocompleteOption index={index} label={name} value={`${id}`}>
      <div className="flex flex-1 items-center gap-4">
        <div className="w-8 xs:hidden">
          {image != null ? <Img src={image} alt={name} /> : <></>}
        </div>

        <div className="flex flex-1 flex-col gap-1 items-start">
          <span className="flex-1 text-base font-medium">{name}</span>
          <span className="flex-1 text-sm text-dimmed">{releaseDate}</span>
        </div>
      </div>
    </AutocompleteOption>
  );
};
