import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ImageEntity } from './ImageEntity';

export class ImageRepository {
  constructor(protected db: DatabaseClient) {}

  async list(config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findUnique({ where: { id } });
  }

  async findByIds(ids: number[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findMany({
      where: { id: { in: ids } },
    });
  }

  async findByPath(path: string, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findUnique({ where: { path } });
  }

  async findByPaths(paths: string[], config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.findMany({
      where: { path: { in: paths } },
    });
  }

  async create(image: Omit<ImageEntity, 'id'>, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    return await trx.image.create({
      data: image,
    });
  }

  async update(
    id: number,
    image: Partial<ImageEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    return await trx.image.update({
      where: { id },
      data: image,
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.image.delete({
      where: { id },
    });
  }
}
