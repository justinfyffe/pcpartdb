import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '@server/db/repository';
import { AccessTokenModel, AccessTokenModelPojo } from './access-token-model';

@Injectable()
export class AccessTokenRepository {
  async save(accessToken: AccessTokenModelPojo, config?: RepositoryConfig) {
    return await AccessTokenModel.query(config?.trx)
      .insert(accessToken)
      .returning('*');
  }

  async findByTokenHash(tokenHash: string, config?: RepositoryConfig) {
    return await AccessTokenModel.query(config?.trx)
      .withGraphFetched('user')
      .findOne({
        tokenHash,
      });
  }

  async delete(id: number, config?: RepositoryConfig) {
    await AccessTokenModel.query(config?.trx).deleteById(id);
  }

  async deleteExpiredSessions(config?: RepositoryConfig) {
    await AccessTokenModel.query(config?.trx)
      .where('dateExpired', '<', new Date())
      .delete();
  }
}
