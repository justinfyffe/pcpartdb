import { Injectable } from '@nestjs/common';
import { DataUpdateRepository as BaseDataUpdateRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class DataUpdateRepository extends BaseDataUpdateRepository {
  constructor(db: Database) {
    super(db);
  }
}
