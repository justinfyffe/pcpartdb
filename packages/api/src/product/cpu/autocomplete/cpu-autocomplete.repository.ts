import { Injectable } from '@nestjs/common';
import { CpuAutocompleteRepository as BaseCpuAutocompleteRepository } from '@pcpartdb/database';
import { Database } from '../../../database';

@Injectable()
export class CpuAutocompleteRepository extends BaseCpuAutocompleteRepository {
  constructor(db: Database) {
    super(db);
  }
}
