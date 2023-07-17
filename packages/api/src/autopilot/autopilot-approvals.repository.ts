import { Injectable } from '@nestjs/common';
import { Database } from '../database';

@Injectable()
export class AutopilotApprovalsRepository {
  constructor(db: Database) {
    super(db);
  }
}
