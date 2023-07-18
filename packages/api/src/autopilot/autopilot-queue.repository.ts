import { Injectable } from '@nestjs/common';
import { Database } from '../database';

@Injectable()
export class AutopilotQueueRepository {
  constructor(db: Database) {
    // super(db);
  }
}
