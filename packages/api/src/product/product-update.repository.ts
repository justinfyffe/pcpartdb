import { Injectable } from '@nestjs/common';
import { ProductUpdateRepository as BaseProductUpdateRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class ProductUpdateRepository extends BaseProductUpdateRepository {
  constructor(db: Database) {
    super(db);
  }
}
