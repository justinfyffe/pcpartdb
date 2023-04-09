import { Injectable } from '@nestjs/common';
import { AccessTokenRepository as BaseAccessTokenRepository } from '@pcpartdb/database';
import { Database } from '../database';

export interface CreateAccessTokenOptions {
  userId: number;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
export class AccessTokenRepository extends BaseAccessTokenRepository {
  constructor(db: Database) {
    super(db);
  }
}
