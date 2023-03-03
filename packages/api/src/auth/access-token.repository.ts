import { Injectable } from '@nestjs/common';
import {
  AccessTokenEntity,
  prisma,
  RepositoryConfig,
} from '@pcpartdb/database';

export interface CreateAccessTokenOptions {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
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
