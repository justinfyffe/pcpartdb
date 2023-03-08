import { Injectable } from '@nestjs/common';
import { Database, RepositoryConfig } from '../database';
import { AccessTokenEntity } from './access-token.entity';

export interface CreateAccessTokenOptions {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
export class AccessTokenRepository {
  constructor(private db: Database) {}

  async create(
    accessToken: Omit<AccessTokenEntity, 'id' | 'user'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    return await trx.accessToken.create({ data: accessToken });
  }

  async findByTokenHash(tokenHash: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.accessToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.accessToken.delete({
      where: { id },
    });
  }
}
