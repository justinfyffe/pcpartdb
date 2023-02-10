import { prisma } from '@server/db/database';
import { RepositoryConfig } from '@server/db/repository';
import { UserEntity } from './user-entity';

export interface CreateUserOptions {
  email: string;
  passwordHash: string;
  isStaff: boolean;
}
export type UpdateUserOptions = Partial<CreateUserOptions>;

export class UserRepository {
  async list(config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    return await trx.user.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    return await trx.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    return await trx.user.findUnique({ where: { email } });
  }

  async count(config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    return await trx.user.count();
  }

  async countStaff(config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    return await trx.user.count({ where: { isStaff: true } });
  }

  async create(
    user: Omit<UserEntity, 'id' | 'registeredAt'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? prisma;
    return await trx.user.create({ data: user });
  }

  async update(
    id: number,
    user: Partial<UserEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? prisma;
    return await trx.user.update({ where: { id }, data: user });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? prisma;
    await trx.user.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
