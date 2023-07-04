import { Injectable } from '@nestjs/common';
import { CpuRepository as BaseCpuRepository } from '@pcpartdb/database';
import { Database } from '../../database';

@Injectable()
export class CpuRepository extends BaseCpuRepository {
  constructor(db: Database) {
    super(db);
  }
}
