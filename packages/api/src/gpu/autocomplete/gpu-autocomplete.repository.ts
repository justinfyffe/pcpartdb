import { Injectable } from '@nestjs/common';
import { GpuEntity, GpuSpecsEntity } from '@pcpartdb/database';
import { Database, RepositoryConfig } from '../../database';

@Injectable()
export class GpuAutocompleteRepository {
  constructor(private db: Database) {}

  async autocomplete(
    query: string,
    config?: RepositoryConfig,
  ): Promise<GpuEntity[]> {
    const db = config?.trx ?? this.db;

    const tokens = query
      .split(' ')
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value.length > 1)
      .join('|');

    // Get results based on search relevancy.
    const priorityResults = await db.gpu.findMany({
      where: {
        OR: [
          { name: { search: tokens, mode: 'insensitive' } },
          { company: { search: tokens, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ['name', 'company'],
          search: tokens,
          sort: 'desc',
        },
      },
      take: 6,
    });

    // Get results based on pattern matching.
    const fillerResultIds: { id: number }[] = await db.$queryRaw`
      SELECT id FROM gpus
      WHERE name ~* (${tokens}) OR company ~* (${tokens})
      ORDER BY release_date DESC
      LIMIT 6
    `;
    const fillerResults = await db.gpu.findMany({
      where: { id: { in: fillerResultIds.map((json) => json.id) } },
      orderBy: { releaseDate: 'desc' },
    });

    // Return top results.
    return [
      ...new Map(
        [...priorityResults, ...fillerResults].map((v) => [v.id, v]),
      ).values(),
    ].slice(0, 6);
  }

  async autocompleteSpec(
    key: keyof GpuSpecsEntity,
    query: string,
    config?: RepositoryConfig,
  ): Promise<string[]> {
    const trx = config?.trx ?? this.db;
    const results = await trx.gpuSpecs.findMany({
      select: { [key]: true },
      distinct: key,
      where: {
        [key]: { contains: query, mode: 'insensitive' },
      },
    });

    return results.map((result) => result[key]);
  }
}
