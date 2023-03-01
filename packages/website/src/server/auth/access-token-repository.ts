import { prisma } from '@pcpartdb/website/server/db/database';
import { RepositoryConfig } from '@pcpartdb/website/server/db/repository';
import { AccessTokenEntity } from './access-token-entity';

export interface CreateAccessTokenOptions {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

export class AccessTokenRepository {
  async create(
    accessToken: Omit<AccessTokenEntity, 'id' | 'user'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? prisma;
    return await trx.accessToken.create({ data: accessToken });
  }

  async findByTokenHash(tokenHash: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    return await trx.accessToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    await trx.accessToken.delete({
      where: { id },
    });
  }
}

export const accessTokenRepository = new AccessTokenRepository();
