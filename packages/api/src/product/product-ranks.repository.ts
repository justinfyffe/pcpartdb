import { Injectable } from '@nestjs/common';
import { ProductRanksRepository as BaseProductRanksRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class ProductRanksRepository extends BaseProductRanksRepository {
  constructor(db: Database) {
    super(db);
  }
}
