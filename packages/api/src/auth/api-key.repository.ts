import { Injectable } from '@nestjs/common';
import { ApiKeyRepository as BaseApiKeyRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class AccessTokenRepository extends BaseApiKeyRepository {
  constructor(db: Database) {
    super(db);
  }
}
