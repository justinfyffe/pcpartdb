import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { UserEntity } from './UserEntity';

export class UserRepository {
  constructor(protected db: DatabaseClient) {}

  async list(config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.user.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.user.findUnique({ where: { email } });
  }

  async count(config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.user.count();
  }

  async countStaff(config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.user.count({ where: { isStaff: true } });
  }

  async create(
    user: Omit<UserEntity, 'id' | 'registeredAt'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.user.create({ data: user });
  }

  async update(
    id: number,
    user: Partial<UserEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    return await trx.user.update({ where: { id }, data: user });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    config?.queryCounter();
    await trx.user.delete({ where: { id } });
  }
}
