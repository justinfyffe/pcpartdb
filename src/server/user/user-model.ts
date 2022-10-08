import { Serializable } from '@server/shared/types/serialize';
import { User } from '@shared/user';
import { Model, PartialModelObject } from 'objection';

export class UserModel extends Model implements Serializable<User> {
  static tableName = 'users';

  // Fields
  id!: number;
  email!: string;
  passwordHash!: string;
  isStaff = false;
  registeredAt!: Date;

  serialize(): User {
    return {
      id: this.id,
      email: this.email,
      isStaff: this.isStaff,
      registeredAt: this.registeredAt.getTime(),
    };
  }
}

export type UserModelPojo = PartialModelObject<UserModel>;
