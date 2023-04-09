import { Injectable } from '@nestjs/common';
import { UserRepository as BaseUserRepository } from '@pcpartdb/database';
import { Database } from '../database';

export interface CreateUserOptions {
  email: string;
  passwordHash: string;
  isStaff: boolean;
}
export type UpdateUserOptions = Partial<CreateUserOptions>;

@Injectable()
export class UserRepository extends BaseUserRepository {
  constructor(db: Database) {
    super(db);
  }
}
