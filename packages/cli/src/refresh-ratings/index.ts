import { refreshRatings } from './refreshRatings';

export interface RefreshRatingsCommandArgs {}

export async function refreshRatingsCommand(_args: RefreshRatingsCommandArgs) {
  await refreshRatings();
}
