import { Injectable } from '@nestjs/common';
import { Repository } from '../db/repository';

@Injectable()
export class AccessTokenRepository extends Repository<AccessTokenEntity> {
  async findByTokenHash(tokenHash: string) {}

  async deleteExpiredSessions() {}
}
