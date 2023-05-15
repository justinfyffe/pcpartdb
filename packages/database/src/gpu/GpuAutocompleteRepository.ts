import { SUPPORTED_GPU_COMPANIES } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { GpuEntity } from './GpuEntity';

export class GpuAutocompleteRepository {
  constructor(protected db: DatabaseClient) {}

  async autocomplete(
    query: string,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? this.db;

    const tokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1);

    const companyTokens: string[] = [];
    const nameTokens: string[] = [];
    for (const token of tokens) {
      if (SUPPORTED_GPU_COMPANIES.includes(token)) {
        companyTokens.push(token);
      } else {
        nameTokens.push(token);
      }
    }

    let regexTokens = query
      .split(' ')
      .filter((value) => value.trim().length > 1)
      .map((value) => `(?=.*${value.trim().toLowerCase()})`)
      .join('');
    regexTokens = `${regexTokens}.*`;

    // Get results based on search relevancy.
    const priorityResultsChipset = await db.gpu.findMany({
      where: {
        AND: [{ chipsetId: null }],
        OR: [
          { name: { search: nameTokens.join(' & '), mode: 'insensitive' } },
          {
            company: { search: companyTokens.join(' & '), mode: 'insensitive' },
          },
        ],
      },
      include: { chipset: true },
      orderBy: {
        _relevance: {
          fields: ['name', 'company'],
          search: tokens.join(' | '),
          sort: 'desc',
        },
      },
      take: 6,
    });
    const priorityResultsRetailModels = await db.gpu.findMany({
      where: {
        AND: [{ chipsetId: { not: null } }],
        OR: [
          { name: { search: nameTokens.join(' & '), mode: 'insensitive' } },
          {
            company: { search: companyTokens.join(' & '), mode: 'insensitive' },
          },
        ],
      },
      include: { chipset: true },
      orderBy: {
        _relevance: {
          fields: ['name', 'company'],
          search: tokens.join(' | '),
          sort: 'desc',
        },
      },
      take: 6,
    });

    // Get results based on pattern matching. Prioritize chipsets over retail models
    const fillerChipsetIds: { id: number }[] = await db.$queryRaw`
      SELECT id FROM gpus
      WHERE chipset_id IS NULL AND CONCAT(company, ' ', name) ~* (${regexTokens})
      ORDER BY release_date DESC
      LIMIT 6
    `;
    const fillerRetailModelIds: { id: number }[] = await db.$queryRaw`
      SELECT id FROM gpus
      WHERE chipset_id IS NOT NULL AND CONCAT(company, ' ', name) ~* (${regexTokens})
      ORDER BY release_date DESC
      LIMIT 6
    `;
    const fillerResultIds = [
      ...fillerChipsetIds,
      ...fillerRetailModelIds,
    ].slice(0, 6);

    const fillerResults = await db.gpu.findMany({
      where: { id: { in: fillerResultIds.map((json) => json.id) } },
      include: { chipset: true },
      orderBy: { releaseDate: 'desc' },
    });

    // Return top results.
    return [
      ...new Map(
        [
          ...priorityResultsChipset,
          ...priorityResultsRetailModels,
          ...fillerResults,
        ].map((v) => [v.id, v]),
      ).values(),
    ].slice(0, 6);
  }

  async autocompleteSpec(
    key: keyof Omit<GpuEntity, 'chipset' | 'retailModels' | 'images'>,
    query: string,
    config?: RepositoryConfig,
  ): Promise<string[]> {
    const trx = config?.trx ?? this.db;
    const results = await trx.gpu.findMany({
      select: { [key]: true },
      distinct: key,
      where: {
        [key]: { contains: query, mode: 'insensitive' },
      },
    });

    return results.map((result) => result[key]);
  }
}
