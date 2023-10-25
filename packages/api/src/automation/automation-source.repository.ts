import { Injectable } from '@nestjs/common';
import { AutomationSourceRepository as BaseAutomationSourceRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class AutomationSourceRepository extends BaseAutomationSourceRepository {
  constructor(db: Database) {
    super(db);
  }
}
