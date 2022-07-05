import { Injectable } from '@nestjs/common';
import { PartialModelObject } from 'objection';
import { ProductBenchmarkModel } from '../../db/models/product-benchmark.model';
import { Repository, RepositoryConfig } from '../../db/repository';
import { ProductBenchmark } from './product-benchmark';

interface Config extends RepositoryConfig {}

@Injectable()
export class ProductBenchmarkRepository extends Repository<
  ProductBenchmarkModel,
  ProductBenchmark
> {
  async save(spec: ProductBenchmark, config?: Config) {
    const row: ProductBenchmarkModel = await ProductBenchmarkModel.query(
      config?.transaction,
    )
      .insert(this.mapToRow(spec))
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');

    return this.mapFromRow(row);
  }

  protected mapFromRow(row: ProductBenchmarkModel): ProductBenchmark {
    return {
      id: row.id,
      productId: row.productId,

      source: row.source,
      key: row.key,
      value: row.value,
    };
  }

  protected mapToRow(
    entity: ProductBenchmark,
  ): PartialModelObject<ProductBenchmarkModel> {
    return {
      id: entity.id,
      productId: entity.productId,

      source: entity.source,
      key: entity.key,
      value: entity.value,
    };
  }
}
