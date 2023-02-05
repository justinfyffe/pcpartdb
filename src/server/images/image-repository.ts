import { prisma } from '@server/db/database';
import { RepositoryConfig } from '@server/db/repository';

export interface CreateImageOptions {
  path: string;
  name: string;

  sourceName?: string;
  sourceUrl?: string;

  fileSize?: number;
  height?: number;
  width?: number;
  uploadedAt?: Date;
}
export type UpdateImageOptions = CreateImageOptions;

export class ImageRepository {
  async list(config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.images.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findById(id: number, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.images.findUnique({ where: { id } });
  }

  async findByIds(ids: number[], config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.images.findMany({
      where: { id: { in: ids } },
    });
  }

  async findByPath(path: string, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.images.findUnique({ where: { path } });
  }

  async findByPaths(paths: string[], config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.images.findMany({
      where: { path: { in: paths } },
    });
  }

  async create(image: CreateImageOptions, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    return await db.images.create({
      data: {
        path: image.path,
        name: image.name,
        source_name: image.sourceName,
        source_url: image.sourceUrl,
        file_size: image.fileSize,
        height: image.height,
        width: image.width,
        updated_at: image.uploadedAt,
      },
    });
  }

  async update(
    id: number,
    image: UpdateImageOptions,
    config?: RepositoryConfig,
  ) {
    const db = config?.trx ?? prisma;
    return await db.images.update({
      where: { id },
      data: {
        path: image.path,
        name: image.name,
        source_name: image.sourceName,
        source_url: image.sourceUrl,
        file_size: image.fileSize,
        height: image.height,
        width: image.width,
        updated_at: image.uploadedAt,
      },
    });
  }

  async delete(id: number, config?: RepositoryConfig) {
    const db = config?.trx ?? prisma;
    await db.images.delete({
      where: { id },
    });
  }
}

export const imageRepository = new ImageRepository();
