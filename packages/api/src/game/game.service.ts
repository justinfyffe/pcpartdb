import { Injectable } from '@nestjs/common';
import {
  mapToGameDto,
  mapToGameDtos,
  mapToGameEntity,
} from '@pcpartdb/database';
import { scrapeGames } from '@pcpartdb/scraper';
import {
  AutocompleteGamesRequest,
  autocompleteGamesRequestSchema,
  AutocompleteGamesResponse,
  CreateGameRequest,
  createGameRequestSchema,
  Game,
  GameScraperOptions,
  ListGamesRequest,
  listGamesRequestSchema,
  ListGamesResponse,
  ScrapeGamesRequest,
  scrapeGamesRequestSchema,
  UpdateGameRequest,
  updateGameRequestSchema,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { GameRepository } from './game.repository';
import { GameEntityCache } from './game-entity.cache';

interface ListOptions {
  skipCount?: boolean;
  bypassCache?: boolean;

  includeScraperOptions?: boolean;
  includeListingImage?: boolean;
  includeRequirements?: boolean;
}

interface GetOptions {
  includeScraperOptions?: boolean;
  includeListingImage?: boolean;
  includeRequirements?: boolean;
}

interface GetByIdOptions extends GetOptions {
  id: number;
  bypassCache?: boolean;
}

interface GetBySlugOptions extends GetOptions {
  slug: string;
  bypassCache?: boolean;
}

interface AutocompleteGamesOptions {
  includeScraperOptions?: boolean;
  includeListingImage?: boolean;
  includeRequirements?: boolean;
}

@Injectable()
export class GameService {
  constructor(
    private repository: GameRepository,
    private gameEntityCache: GameEntityCache,
  ) {}

  async count(request: ListGamesRequest, ctx: Context) {
    validate(request, listGamesRequestSchema);

    const { query } = request;
    const count = await this.repository.count({ ...query }, ctx);

    return count;
  }

  async list(request: ListGamesRequest, options: ListOptions, ctx: Context) {
    validate(request, listGamesRequestSchema);

    const includeScraperOptions =
      (options?.includeScraperOptions ?? false) && (ctx.user?.isStaff ?? false);
    const includeListingImage = options?.includeListingImage ?? false;
    const includeRequirements = options?.includeRequirements ?? false;

    const skipCount = options.skipCount ?? false;
    const { query } = request;

    const gameIds = await this.repository.list2(
      { ...query, ...(options as any) },
      ctx,
    );
    const gameEntities = await this.gameEntityCache.getGamesByIds(
      { ids: gameIds, includeRequirements },
      ctx,
    );

    let count: number;
    if (!skipCount) {
      count = await this.count(request, ctx);
    }

    const games: Game[] = await mapToGameDtos(gameEntities, {
      includeScraperOptions,
      includeListingImage,
      includeRequirements,
    });

    const response: ListGamesResponse = {
      query,
      results: games,
      total: count,
    };

    return response;
  }

  async getById(options: GetByIdOptions, ctx: Context) {
    const id = options.id;
    const includeScraperOptions =
      (options?.includeScraperOptions ?? false) && (ctx.user?.isStaff ?? false);
    const includeListingImage = options?.includeListingImage ?? false;
    const includeRequirements = options?.includeRequirements ?? false;

    const entity = await this.gameEntityCache.getGameById(
      { id, includeRequirements, bypassCache: options.bypassCache },
      ctx,
    );

    const game = await mapToGameDto(entity, {
      includeScraperOptions,
      includeListingImage,
      includeRequirements,
    });

    if (game == null) {
      throw notFoundError({ game: id });
    }

    return game;
  }

  async getBySlug(options: GetBySlugOptions, ctx: Context) {
    const slug = options.slug;
    const includeScraperOptions =
      (options?.includeScraperOptions ?? false) && (ctx.user?.isStaff ?? false);
    const includeRequirements = options?.includeRequirements ?? false;

    const entity = await this.gameEntityCache.getGameBySlug(
      { slug, includeRequirements, bypassCache: options.bypassCache },
      ctx,
    );
    const game = await mapToGameDto(entity, { includeScraperOptions });

    if (game == null) {
      throw notFoundError({ game: slug });
    }

    return game;
  }

  async scrape(request: ScrapeGamesRequest, ctx: Context) {
    validate(request, scrapeGamesRequestSchema);
    const { externalUrl, newGamesOnly } = request;

    const response = await scrapeGames({ externalUrl });

    if (newGamesOnly) {
      // Filter games
      const entities = await this.repository.listAll(ctx);
      const allGameNames = new Set<string>(
        entities.map(
          (entity) =>
            (entity.scraperOptions as GameScraperOptions)?.notebookCheckName,
        ),
      );
      response.games = response.games.filter(
        (game) => !allGameNames.has(game.scraperOptions?.notebookCheckName),
      );
    }

    return response;
  }

  async create(request: CreateGameRequest, ctx: Context) {
    validate(request, createGameRequestSchema);

    const game = request.game;

    // Check if another game exists at the slug
    const existingGame = await this.gameEntityCache.getGameBySlug(
      { slug: game.slug, bypassCache: true },
      ctx,
    );

    if (existingGame != null) {
      throw badRequestError({
        property: 'slug',
        constraint: ValidationErrorType.GameExistsAtSlug,
      });
    }

    const entity = mapToGameEntity({ ...game, id: undefined });
    const result = await this.repository.create(entity, ctx);
    return mapToGameDto(result);
  }

  async update(id: number, request: UpdateGameRequest, ctx: Context) {
    validate(request, updateGameRequestSchema);

    const game = request.game;

    // Check if another game exists at the slug
    const existingGame = await this.gameEntityCache.getGameBySlug(
      { slug: game.slug, bypassCache: true },
      ctx,
    );
    if (existingGame != null && existingGame.id !== id) {
      throw badRequestError({
        property: 'slug',
        constraint: ValidationErrorType.GameExistsAtSlug,
      });
    }

    const entity = mapToGameEntity({ ...game, id: undefined });
    const result = await this.repository.update(id, entity, ctx);
    await this.gameEntityCache.invalidate({ id });
    return mapToGameDto(result);
  }

  async delete(id: number, ctx: Context) {
    const game = await this.gameEntityCache.getGameById(
      { id, bypassCache: true },
      ctx,
    );
    if (game == null) {
      throw notFoundError({ gpu: id });
    }

    await this.repository.delete(id, ctx);
    await this.gameEntityCache.invalidate({ id });
    return id;
  }

  async getScraperOptions(ctx: Context) {
    return await this.repository.getScraperOptions(ctx);
  }

  async autocomplete(
    request: AutocompleteGamesRequest,
    options: AutocompleteGamesOptions,
    ctx: Context,
  ) {
    validate(request, autocompleteGamesRequestSchema);

    const { query } = request;
    const includeScraperOptions =
      (options?.includeScraperOptions ?? false) && (ctx.user?.isStaff ?? false);
    const includeListingImage = options?.includeListingImage ?? false;
    const includeRequirements = options?.includeRequirements ?? false;

    const gameEntities = await this.repository.autocomplete(
      { query: query || '', includeRequirements },
      ctx,
    );

    const games: Game[] = await mapToGameDtos(gameEntities, {
      includeScraperOptions,
      includeListingImage,
      includeRequirements,
    });

    return {
      results: games,
    } as AutocompleteGamesResponse;
  }
}
