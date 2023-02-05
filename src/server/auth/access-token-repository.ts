import { prisma } from '@server/db/database';
import { RepositoryConfig } from '@server/db/repository';

export interface CreateAccessTokenOptions {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

export class AccessTokenRepository {
  async create(
    accessToken: CreateAccessTokenOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? prisma;
    return await db.access_tokens.create({
      data: {
        user_id: accessToken.userId,
        token_hash: accessToken.tokenHash,
        expires_at: accessToken.expiresAt,
      },
    });
  }

  async findByTokenHash(tokenHash: string, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.access_tokens.findUnique({
      where: { token_hash: tokenHash },
      include: { users: true },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    await db.access_tokens.delete({
      where: { id },
    });
  }
}

export const accessTokenRepository = new AccessTokenRepository();
