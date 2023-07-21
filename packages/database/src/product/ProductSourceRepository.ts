import { DatabaseClient } from '../DatabaseClient';
import { RepositoryConfig } from '../RepositoryConfig';
import { ProductSourceEntity } from './ProductSourceEntity';

export class ProductSourceRepository {
  constructor(protected db: DatabaseClient) {}

  async create(
    data: Omit<ProductSourceEntity, 'id'>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productSource.create({ data: entity });
  }

  async update(
    id: number,
    data: Partial<ProductSourceEntity>,
    config?: RepositoryConfig,
  ) {
    const trx = config?.trx ?? this.db;
    const { ...entity } = data;

    return await trx.productSource.update({
      where: { id },
      data: entity,
    });
  }

  async archive(id: number, config?: RepositoryConfig) {
    return await this.update(id, { archived: true }, config);
  }

  async delete(id: number, config?: RepositoryConfig) {
    const trx = config?.trx ?? this.db;
    await trx.productSource.delete({ where: { id } });
  }
}
