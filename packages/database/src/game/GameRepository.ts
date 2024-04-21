import {
  ListGamesFilter,
  ListGamesQuery,
  ListOrder,
  ListOrderBy,
  ListSort,
} from '@pcpartdb/shared';
import { Prisma } from '@prisma/client';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { GameEntity } from './GameEntity';

const AUTOCOMPLETE_LIMIT = 25;

interface FindByIdsOptions {
  ids: number[];
}

interface FindByIdOptions extends IncludeRelationOptions {
  id: number;
}

interface FindBySlugOptions extends IncludeRelationOptions {
  slug: string;
}

interface CountOptions extends ListGamesQuery {}

interface ListOptions extends ListGamesQuery, IncludeRelationOptions {}

interface AutocompleteOptions extends IncludeRelationOptions {
  query: string;
}

interface IncludeRelationOptions {
  includeRequirements?: boolean;
}

export class GameRepository {
  constructor(protected db: DatabaseClient) {}

  async findByIds(options: FindByIdsOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;
    const results = await db.game.findMany({
      where: { id: { in: options.ids } },
      include: {
        listingImage: true,
      },
    });
    return results;
  }

  async findById2(
    options: FindByIdOptions,
    config?: RepositoryConfig,
  ): Promise<GameEntity> {
    const db = config?.trx ?? this.db;

    const id = options.id;

    const result: GameEntity = await db.game.findUnique({
      where: { id },
      include: { listingImage: true },
    });
    return result;
  }

  async findById(
    options: FindByIdOptions,
    config?: RepositoryConfig,
  ): Promise<GameEntity> {
    const db = config?.trx ?? this.db;

    const id = options.id;
    const includeRequirements = options?.includeRequirements ?? false;

    const game: GameEntity = await db.game.findUnique({
      where: { id },
      include: {
        listingImage: true,
        minimumCpu: includeRequirements,
        minimumGpu: includeRequirements,
        recommendedCpu: includeRequirements,
        recommendedGpu: includeRequirements,
      },
    });

    return game;
  }

  async findBySlug2(
    options: FindBySlugOptions,
    config?: RepositoryConfig,
  ): Promise<GameEntity> {
    const db = config?.trx ?? this.db;

    const slug = options.slug;

    const result: GameEntity = await db.game.findUnique({
      where: { slug },
      include: { listingImage: true },
    });
    return result;
  }

  async findBySlug(
    options: FindBySlugOptions,
    config?: RepositoryConfig,
  ): Promise<GameEntity> {
    const db = config?.trx ?? this.db;

    const slug = options.slug;
    const includeRequirements = options?.includeRequirements ?? false;

    const game: GameEntity = await db.game.findUnique({
      where: { slug: slug },
      include: {
        listingImage: true,
        minimumCpu: includeRequirements,
        minimumGpu: includeRequirements,
        recommendedCpu: includeRequirements,
        recommendedGpu: includeRequirements,
      },
    });

    return game;
  }

  async count(options: CountOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const where = this.generateWhere(options.filter);
    return await db.game.count({
      where,
    });
  }

  async listAll(config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const results = await db.game.findMany();
    return results;
  }

  async list2(options: ListOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const where = this.generateWhere(options.filter);
    const orderBy = this.generateOrderBy(options.orderBy);
    const results = await db.game.findMany({
      select: { id: true },
      where,
      orderBy,
      skip: options.pagination?.offset,
      take: options.pagination?.limit,
    });
    return results.map(({ id }) => id);
  }

  async list(options: ListOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? this.db;

    const includeRequirements = options?.includeRequirements ?? false;

    const where = this.generateWhere(options.filter);
    const orderBy = this.generateOrderBy(options.orderBy);
    const results = await db.game.findMany({
      include: {
        listingImage: true,
        minimumCpu: includeRequirements,
        minimumGpu: includeRequirements,
        recommendedCpu: includeRequirements,
        recommendedGpu: includeRequirements,
      },
      where,
      orderBy,
      skip: options.pagination?.offset,
      take: options.pagination?.limit,
    });
    return results;
  }

  async create(game: Omit<GameEntity, 'id'>, config?: RepositoryConfig) {
    const {
      minimumCpu: _minimumCpu,
      recommendedCpu: _recommendedCpu,
      minimumGpu: _minimumGpu,
      recommendedGpu: _recommendedGpu,
      listingImage: _listingImage,
      fps: _fps,
      ...gameData
    } = game;

    const trx = config?.trx ?? this.db;
    return await trx.game.create({
      data: {
        ...gameData,
      },
    });
  }

  async update(
    id: number,
    game: Omit<GameEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const {
      minimumCpu: _minimumCpu,
      recommendedCpu: _recommendedCpu,
      minimumGpu: _minimumGpu,
      recommendedGpu: _recommendedGpu,
      listingImage: _listingImage,
      fps: _fps,
      ...gameData
    } = game;

    const trx = config?.trx ?? this.db;
    return await trx.game.update({
      where: { id },
      data: { ...gameData },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.game.delete({ where: { id } });
  }

  async getScraperOptions(config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.game.findMany({
      select: {
        id: true,
        name: true,
        gameSettings: true,
        releaseDate: true,
        scraperOptions: true,
        listingImage: {
          select: { path: true },
        },
      },
    });
  }

  async autocomplete(options: AutocompleteOptions, config?: RepositoryConfig) {
    const { query } = options;

    const includeRequirements = options.includeRequirements ?? false;

    const tokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1);

    let regexTokens = query
      .split(' ')
      .filter((value) => value.trim().length > 1)
      .map((value) => `(?=.*${value.trim().toLowerCase()})`)
      .join('');
    regexTokens = `${regexTokens}.*`;

    const trx = config?.trx ?? this.db;
    const priorityGames = await trx.game.findMany({
      where: {
        OR: [
          { name: { search: tokens.join(' & '), mode: 'insensitive' } },
          { nameShort: { search: tokens.join(' & '), mode: 'insensitive' } },
        ],
      },
      include: {
        listingImage: true,
        minimumCpu: includeRequirements,
        minimumGpu: includeRequirements,
        recommendedCpu: includeRequirements,
        recommendedGpu: includeRequirements,
      },
    });

    // Get results based on regex.
    let fillerGames: { id: number }[] = [];
    if (regexTokens !== '.*') {
      fillerGames = await trx.$queryRaw`
        SELECT id FROM games
        WHERE name ~* (${regexTokens}) OR name_short ~* (${regexTokens})
        LIMIT ${AUTOCOMPLETE_LIMIT}
      `;
    } else {
      fillerGames = await trx.game.findMany({
        take: AUTOCOMPLETE_LIMIT,
      });
    }
    const fillerResultIds = [...fillerGames].slice(0, AUTOCOMPLETE_LIMIT);

    const fillerResults = await trx.game.findMany({
      where: { id: { in: fillerResultIds.map((json) => json.id) } },
      include: {
        listingImage: true,
        minimumCpu: includeRequirements,
        minimumGpu: includeRequirements,
        recommendedCpu: includeRequirements,
        recommendedGpu: includeRequirements,
      },
    });

    // Return top results.
    return [
      ...new Map(
        [...priorityGames, ...fillerResults].map((v) => [v.id, v]),
      ).values(),
    ].slice(0, AUTOCOMPLETE_LIMIT);
  }

  private generateWhere(filter: ListGamesFilter): Prisma.GameWhereInput {
    const searchTextWhere = filter?.search
      ? { contains: filter.search, mode: 'insensitive' as Prisma.QueryMode }
      : undefined;

    return {
      OR:
        searchTextWhere != null
          ? [{ name: searchTextWhere }, { nameShort: searchTextWhere }]
          : undefined,
    };
  }

  private generateOrderBy(
    orderBy: ListOrderBy,
  ):
    | Prisma.GameOrderByWithRelationAndSearchRelevanceInput
    | Prisma.GameOrderByWithRelationAndSearchRelevanceInput[] {
    if (orderBy == null) {
      return { releaseDate: { sort: 'desc', nulls: 'last' } };
    }

    const { sort } = orderBy;
    if (sort === ListSort.Id) {
      // Default ASC
      const order = orderBy?.order ?? ListOrder.Asc;
      return { id: order };
    } else if (sort === ListSort.Name) {
      // Default ASC
      const order = orderBy?.order ?? ListOrder.Asc;
      return { name: order };
    } else if (sort === ListSort.ReleaseDate) {
      // Default DESC
      const order = orderBy?.order ?? ListOrder.Desc;
      return { releaseDate: { sort: order, nulls: 'last' } };
    }

    return { releaseDate: { sort: 'desc', nulls: 'last' } };
  }
}
