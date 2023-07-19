import { Injectable } from '@nestjs/common';
import { Database } from '../database';

@Injectable()
export class AutomationQueueRepository {
  constructor(db: Database) {
    // super(db);
  }
}
