import { Injectable } from '@nestjs/common';
import { ProductSourceRepository as BaseProductSourceRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class ProductSourceRepository extends BaseProductSourceRepository {
  constructor(db: Database) {
    super(db);
  }
}
