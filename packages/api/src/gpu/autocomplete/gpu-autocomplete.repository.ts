import { Injectable } from '@nestjs/common';
import { GpuAutocompleteRepository as BaseGpuAutocompleteRepository } from '@pcpartdb/database';
import { Database } from '../../database';

@Injectable()
export class GpuAutocompleteRepository extends BaseGpuAutocompleteRepository {
  constructor(db: Database) {
    super(db);
  }
}
