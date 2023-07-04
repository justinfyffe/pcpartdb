import { SUPPORTED_CPU_COMPANIES } from '@pcpartdb/shared';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { CpuEntity } from './CpuEntity';

export class CpuAutocompleteRepository {
  constructor(protected db: DatabaseClient) {}

  async autocomplete(
    query: string,
    config?: RepositoryConfig,
  ): Promise<CpuEntity[]> {
    const db = config?.trx ?? this.db;

    const tokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1);

    const companyTokens: string[] = [];
    const nameTokens: string[] = [];
    for (const token of tokens) {
      if (SUPPORTED_CPU_COMPANIES.includes(token)) {
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
    const priorityCpus = await db.cpu.findMany({
      where: {
        OR: [
          { name: { search: nameTokens.join(' & '), mode: 'insensitive' } },
          {
            company: { search: companyTokens.join(' & '), mode: 'insensitive' },
          },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ['name', 'company'],
          search: tokens.join(' | '),
          sort: 'desc',
        },
      },
      take: 6,
    });

    // Get results based on pattern matching.
    const fillerCpus: { id: number }[] = await db.$queryRaw`
      SELECT id FROM cpus
      WHERE CONCAT(company, ' ', name) ~* (${regexTokens})
      ORDER BY release_date DESC NULLS LAST
      LIMIT 6
    `;
    const fillerResultIds = [...fillerCpus].slice(0, 6);

    const fillerResults = await db.cpu.findMany({
      where: { id: { in: fillerResultIds.map((json) => json.id) } },
      orderBy: { releaseDate: 'desc' },
    });

    // Return top results.
    return [
      ...new Map(
        [...priorityCpus, ...fillerResults].map((v) => [v.id, v]),
      ).values(),
    ].slice(0, 6);
  }

  async autocompleteData(
    key: keyof Omit<CpuEntity, 'images'>,
    query: string,
    config?: RepositoryConfig,
  ): Promise<string[]> {
    const trx = config?.trx ?? this.db;
    const results = await trx.cpu.findMany({
      select: { [key]: true },
      distinct: key,
      where: {
        [key]: { contains: query, mode: 'insensitive' },
      },
    });

    return results.map((result) => result[key]);
  }
}
