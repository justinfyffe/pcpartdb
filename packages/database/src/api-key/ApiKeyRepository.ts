import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ApiKeyEntity } from './ApiKeyEntity';

export class ApiKeyRepository {
  constructor(protected db: DatabaseClient) {}

  async refresh(
    apiKey: Omit<ApiKeyEntity, 'id' | 'user'>,
    config?: RepositoryConfig,
  ) {
    const userId = apiKey.userId;

    const trx = config?.trx ?? this.db;
    await this.deleteByUserId(userId, config);
    return await trx.apiKey.create({ data: apiKey });
  }

  async findByUserId(userId: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.apiKey.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findByKey(key: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.apiKey.findUnique({
      where: { apiKey: key },
      include: { user: true },
    });
  }

  async deleteByUserId(userId: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.apiKey.delete({ where: { userId } });
  }
}
