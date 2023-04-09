import { Injectable } from '@nestjs/common';
import { GpuRanksRepository as BaseGpuRanksRepository } from '@pcpartdb/database';
import { Database } from '../../database';

@Injectable()
export class GpuRanksRepository extends BaseGpuRanksRepository {
  constructor(db: Database) {
    super(db);
  }
}
