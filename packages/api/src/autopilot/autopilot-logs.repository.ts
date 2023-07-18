import { Injectable } from '@nestjs/common';
import { Database } from '../database';

@Injectable()
export class AutopilotLogsRepository {
  constructor(db: Database) {
    // super(db);
  }
}
