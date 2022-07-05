import { Injectable } from '@nestjs/common';
import { PartialModelObject } from 'objection';
import { RepositoryConfig } from '../db/repository';
import { AccessTokenModel } from './access-token.model';

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

export type AccessTokenModelPojo = PartialModelObject<AccessTokenModel>;
