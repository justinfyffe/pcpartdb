import { Injectable } from '@nestjs/common';
import { Database } from '../database';

@Injectable()
export class AutopilotApprovalRepository {
  constructor(db: Database) {
    super(db);
  }
}
