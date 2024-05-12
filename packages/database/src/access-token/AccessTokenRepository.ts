import { Injectable } from '@nestjs/common';
import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { AccessTokenEntity } from './AccessTokenEntity';

export interface CreateAccessTokenOptions {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
export class AccessTokenRepository {
  constructor(protected db: DatabaseClient) {}

  async create(
    accessToken: Omit<AccessTokenEntity, 'id' | 'user'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    return await trx.accessToken.create({ data: accessToken });
  }

  async findByTokenHash(tokenHash: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.accessToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    await trx.accessToken.delete({
      where: { id },
    });
  }
}
