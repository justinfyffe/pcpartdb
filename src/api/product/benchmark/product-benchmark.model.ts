import { Model, PartialModelObject } from 'objection';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
  productBenchmarkSchema,
} from '../../../types/product-benchmark';
import { CanDto } from '../../shared/types/normalize';

export class ProductBenchmarkModel<T = unknown>
  extends Model
  implements CanDto<ProductBenchmark>
{
  dtoSchema = productBenchmarkSchema;

  static tableName = 'product_benchmarks';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductBenchmarkKey;
  value?: T;

  toDto(): ProductBenchmark {
    return {
      id: this.id,
      productId: this.productId,
      source: this.source,
      key: this.key,
      value: this.value,
    };
  }
}

export type ProductBenchmarkModelPojo =
  PartialModelObject<ProductBenchmarkModel>;
