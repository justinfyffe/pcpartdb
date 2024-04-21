import { Game } from '../game';
import { ProductGame } from '../product';

export interface FormatGameNameOptions {
  short?: boolean;
  long?: boolean;
}

export function formatGameName(
  gameOrProductGame: Partial<Game> | Partial<ProductGame>,
  options?: FormatGameNameOptions,
) {
  if (gameOrProductGame == null) {
    return null;
  }

  let game: Partial<Game>;
  if ('game' in gameOrProductGame) {
    game = gameOrProductGame.game;
  } else {
    game = gameOrProductGame as Game;
  }

  if (options?.long) {
    return game.name;
  } else if (options?.short) {
    return game.nameShort || game.name;
  }

  return game.name;
}
