//
// List Games Request
//

import { ListRequest, ListResponse } from '../common';
import { Game } from './common';
import { ListGamesAdditionalData, ListGamesQuery } from './lists';

export interface ListGamesRequest<
  TQuery extends ListGamesQuery = ListGamesQuery,
> extends ListRequest<TQuery> {}

export interface ListGamesResponse<
  TQuery extends ListGamesQuery = ListGamesQuery,
  TResult extends Game = Game,
> extends ListResponse<TQuery, TResult> {
  additionalData?: ListGamesAdditionalData;
}

//
// Create Game Request

export interface CreateGameRequest {
  game: Game;
}

// Update Game Request

export interface UpdateGameRequest {
  game: Game;
}

// Autocomplete Games Request

export interface AutocompleteGamesRequest {
  query?: string;
}

export interface AutocompleteGamesResponse {
  results: Game[];
}
