import { Injectable } from '@nestjs/common';
import { CpuRanksRepository as BaseCpuRanksRepository } from '@pcpartdb/database';
import { Database } from '../../../database';

@Injectable()
export class CpuRanksRepository extends BaseCpuRanksRepository {
  constructor(db: Database) {
    super(db);
  }
}
