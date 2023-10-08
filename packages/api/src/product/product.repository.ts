import { Injectable } from '@nestjs/common';
import { ProductRepository as BaseProductRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class ProductRepository extends BaseProductRepository {
  constructor(db: Database) {
    super(db);
  }
}
