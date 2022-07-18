import { Model, PartialModelObject } from 'objection';
import { User, userSchema } from '../../types/user';
import { CanDto } from '../shared/types/normalize';

export class UserModel extends Model implements CanDto<User> {
  static tableName = 'users';

  // Fields
  id!: number;
  email!: string;
  passwordHash!: string;
  isStaff = false;
  registeredAt!: Date;

  toDto(): User {
    return {
      id: this.id,
      email: this.email,
      isStaff: this.isStaff,
      registeredAt: this.registeredAt.getTime(),
    };
  }

  getSchema() {
    return userSchema;
  }
}

export type UserModelPojo = PartialModelObject<UserModel>;
