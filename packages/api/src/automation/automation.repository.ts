import { Injectable } from '@nestjs/common';
import { AutomationActionRepository as BaseAutomationActionRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class AutomationRepository extends BaseAutomationActionRepository {
  constructor(db: Database) {
    super(db);
  }
}
