import { Model, PartialModelObject } from 'objection';
import { UserModel } from '../user/user.model';

export class AccessTokenModel extends Model {
  static tableName = 'access_tokens';

  // Fields
  id!: number;
  userId!: number;
  tokenHash!: string;
  expiresAt!: Date;

  // Relations
  user?: UserModel;

  static relationMappings = {
    user: {
      relation: Model.HasOneRelation,
      modelClass: UserModel,
      join: {
        from: 'access_tokens.userId',
        to: 'users.id',
      },
    },
  };
}

export type AccessTokenModelPojo = PartialModelObject<AccessTokenModel>;
