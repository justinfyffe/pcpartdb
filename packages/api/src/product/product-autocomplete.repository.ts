import { Injectable } from '@nestjs/common';
import { ProductAutocompleteRepository as BaseProductAutocompleteRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class ProductAutocompleteRepository extends BaseProductAutocompleteRepository {
  constructor(db: Database) {
    super(db);
  }
}
