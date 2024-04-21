//
// Scrape Games Request
//

import { Game } from '../../game';

export interface ScrapeGamesRequest {
  externalUrl: string;
  newGamesOnly?: boolean;
}

export interface ScrapeGamesResponse {
  games?: Partial<Game>[];
}
