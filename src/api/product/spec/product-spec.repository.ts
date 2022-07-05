import { Injectable } from '@nestjs/common';
import { PartialModelObject } from 'objection';
import { ProductSpecModel } from '../../db/models/product-spec.model';
import { Repository, RepositoryConfig } from '../../db/repository';
import { ProductSpec } from './product-spec';

interface Config extends RepositoryConfig {}

@Injectable()
export class ProductSpecRepository extends Repository<
  ProductSpecModel,
  ProductSpec
> {
  async save(spec: ProductSpec, config?: Config) {
    const row: ProductSpecModel = await ProductSpecModel.query(
      config?.transaction,
    )
      .insert(this.mapToRow(spec))
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');

    return this.mapFromRow(row);
  }

  mapFromRow(row: ProductSpecModel): ProductSpec {
    return {
      id: row.id,
      productId: row.productId,

      source: row.source,
      key: row.key,
      value: row.value,
    };
  }

  mapToRow(entity: ProductSpec): PartialModelObject<ProductSpecModel> {
    return {
      id: entity.id,
      productId: entity.productId,

      source: entity.source,
      key: entity.key,
      value: entity.value,
    };
  }
}
