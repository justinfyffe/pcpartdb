import { Injectable } from '@nestjs/common';
import { Database } from '../database';

@Injectable()
export class AutopilotLogRepository {
  constructor(db: Database) {
    super(db);
  }
}
