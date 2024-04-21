import { Game } from '@pcpartdb/shared';
import { imagePath } from './imagePath';
import { placeholderGameImagePath } from './placeholderGameImagePath';

export function gameListingImagePath(game: Partial<Game>) {
  if (game?.listingImage != null) {
    return imagePath(game.listingImage);
  }

  return placeholderGameImagePath();
}
