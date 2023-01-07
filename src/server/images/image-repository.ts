import { RepositoryConfig } from '@server/db/repository';
import { ImageModel, ImageModelPojo } from './image-model';

export class ImageRepository {
  async list(config?: RepositoryConfig) {
    return await ImageModel.query(config?.trx).orderBy('id', 'DESC');
  }

  async save(image: ImageModelPojo, config?: RepositoryConfig) {
    return await ImageModel.query(config?.trx)
      .insert(image)
      .onConflict('id')
      .merge()
      .returning('*');
  }

  async delete(id: number, config?: RepositoryConfig) {
    return await ImageModel.query(config?.trx).deleteById(id);
  }

  async findById(id: number, config?: RepositoryConfig) {
    return await ImageModel.query(config?.trx).findById(id);
  }

  async findByIds(ids: number[], config?: RepositoryConfig) {
    return await ImageModel.query(config?.trx).whereIn('id', ids);
  }

  async findByPath(path: string, config?: RepositoryConfig) {
    return await ImageModel.query(config?.trx).findOne({ path });
  }

  async findByPaths(paths: string[], config?: RepositoryConfig) {
    return await ImageModel.query(config?.trx).whereIn('paths', paths);
  }
}

export const imageRepository = new ImageRepository();
