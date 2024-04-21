import { Injectable } from '@nestjs/common';
import { GameRepository as BaseGameRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class GameRepository extends BaseGameRepository {
  constructor(db: Database) {
    super(db);
  }
}
