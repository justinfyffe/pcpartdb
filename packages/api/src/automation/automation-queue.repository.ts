import { Injectable } from '@nestjs/common';
import { AutomationQueueRepository as BaseAutomationQueueRepository } from '@pcpartdb/database';
import { Database } from '../database';

@Injectable()
export class AutomationQueueRepository extends BaseAutomationQueueRepository {
  constructor(db: Database) {
    super(db);
  }
}
