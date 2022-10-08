import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '@server/db/repository';
import { ImageModel, ImageModelPojo } from './image-model';

@Injectable()
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
}
