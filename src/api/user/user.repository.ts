import { RepositoryConfig } from '../db/repository';
import { UserModel, UserModelPojo } from './user.model';

export class UserRepository {
  async list(config?: RepositoryConfig) {
    return await UserModel.query(config?.trx).orderBy('id', 'DESC');
  }

  async save(user: UserModelPojo, config?: RepositoryConfig) {
    return await UserModel.query(config?.trx)
      .insert(user)
      .onConflict('email')
      .merge()
      .returning('*');
  }

  async delete(id: number, config?: RepositoryConfig) {
    return await UserModel.query(config?.trx).deleteById(id);
  }

  async findById(id: number, config?: RepositoryConfig) {
    return await UserModel.query(config?.trx).findById(id);
  }

  async findByEmail(email: string, config?: RepositoryConfig) {
    return await UserModel.query(config?.trx).findOne({ email });
  }

  async count(config?: RepositoryConfig) {
    return await UserModel.query(config?.trx).resultSize();
  }
}
