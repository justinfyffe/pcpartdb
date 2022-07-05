import { Model, PartialModelObject } from 'objection';
import { User, userSchema } from '../../types/user';
import { CanDto } from '../shared/types/normalize';

export class UserModel extends Model implements CanDto<User> {
  dtoSchema = userSchema;

  static tableName = 'users';

  // Fields
  id!: number;
  email!: string;
  passwordHash?: string;
  isStaff = false;
  dateRegistered!: Date;

  toDto(): User {
    return {
      id: this.id,
      email: this.email,
      isStaff: this.isStaff,
      dateRegistered: this.dateRegistered.getTime(),
    };
  }
}

export type UserModelPojo = PartialModelObject<UserModel>;
