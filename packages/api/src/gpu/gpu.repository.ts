import { Injectable } from '@nestjs/common';
import { GpuRepository as BaseGpuRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class GpuRepository extends BaseGpuRepository {
  constructor(db: Database) {
    super(db);
  }
}
