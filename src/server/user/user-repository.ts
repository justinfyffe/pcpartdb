import { prisma } from '@server/db/database';
import { RepositoryConfig } from '@server/db/repository';

export interface CreateUserOptions {
  email: string;
  passwordHash: string;
  isStaff: boolean;
}
export type UpdateUserOptions = Partial<CreateUserOptions>;

export class UserRepository {
  async list(config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.users.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.users.findUnique({ where: { id } });
  }

  async findByEmail(email: string, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.users.findUnique({ where: { email } });
  }

  async count(config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.users.count();
  }

  async countStaff(config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.users.count({ where: { is_staff: true } });
  }

  async create(user: CreateUserOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.users.create({
      data: {
        email: user.email,
        password_hash: user.passwordHash,
        is_staff: user.isStaff,
      },
    });
  }

  async update(id: number, user: UpdateUserOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.users.update({
      where: { id },
      data: {
        email: user.email,
        password_hash: user.passwordHash,
        is_staff: user.isStaff,
      },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    await db.users.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
