import {
  AutocompleteGamesRequest,
  AutocompleteGamesResponse,
  CreateGameRequest,
  Game,
  joinUrlParts,
  ListGamesQuery,
  ListGamesRequest,
  ListGamesResponse,
  ScrapeGamesRequest,
  ScrapeGamesResponse,
  UpdateGameRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api/apiClient';
import { RequestConfig } from '../../shared/api/types';
import { GameCache } from '../../shared/cache/GameCache';

const PATH = 'games';

export class GameService {
  constructor(private api: ApiClient) {}

  async list(query: ListGamesQuery, config?: RequestConfig) {
    const response = await this.api.get<ListGamesResponse>(PATH, {
      ...config,
      params: {
        req: JSON.stringify({ query } as ListGamesRequest),
      },
    });
    GameCache.save({ games: response.results });
    return response;
  }

  async create(data: CreateGameRequest) {
    const game = await this.api.post<Game>(PATH, data);
    GameCache.save({ games: [game] });
    return game;
  }

  async update(id: number, data: UpdateGameRequest) {
    const path = joinUrlParts(PATH, String(id));
    const game = await this.api.put<Game>(path, data);
    GameCache.save({ games: [game] });
    return game;
  }

  async delete(id: number) {
    const path = joinUrlParts(PATH, String(id));
    const game = await this.api.delete(path);
    GameCache.delete(id);
    return game;
  }

  async autocomplete(query: string) {
    const path = joinUrlParts(PATH, 'autocomplete');
    const response = await this.api.get<AutocompleteGamesResponse>(path, {
      params: {
        req: JSON.stringify({
          query,
        } as AutocompleteGamesRequest),
      },
    });

    const games = response.results;
    GameCache.save({ games });
    return games;
  }

  async scrape(request: ScrapeGamesRequest) {
    const path = joinUrlParts(PATH, 'scrape');
    const response = await this.api.post<ScrapeGamesResponse>(path, request);

    return response;
  }
}

export const gameService = new GameService(apiClient);
