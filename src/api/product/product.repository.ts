import { Injectable } from '@nestjs/common';
import { PartialModelObject } from 'objection';
import { ProductModel } from '../db/models/product.model';
import { Repository, RepositoryConfig } from '../db/repository';
import { Product } from './product';

interface Config extends RepositoryConfig {}

@Injectable()
export class ProductRepository extends Repository<ProductModel, Product> {
  async save(product: Product, config?: Config) {
    const row: ProductModel = await ProductModel.query(config?.transaction)
      .insert(this.mapToRow(product))
      .onConflict('slug')
      .merge()
      .returning('*');

    return this.mapFromRow(row);
  }

  async findBySlug(slug: string, config?: Config) {
    const row = await ProductModel.query(config?.transaction).findOne({ slug });

    if (row == null) {
      return null;
    }

    return this.mapFromRow(row);
  }

  protected mapFromRow(row: ProductModel): Product {
    return {
      id: row.id,
      slug: row.slug,

      type: row.type,
      name: row.name,

      specs: [],
      benchmarks: [],
    };
  }

  protected mapToRow(entity: Product): PartialModelObject<ProductModel> {
    return {
      id: entity.id,
      slug: entity.slug,

      type: entity.type,
      name: entity.name,
    };
  }
}
