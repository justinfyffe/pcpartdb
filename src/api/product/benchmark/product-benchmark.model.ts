import { Model, PartialModelObject } from 'objection';
import {
  ProductBenchmark,
  ProductBenchmarkKey,
  productBenchmarkSchema,
  ProductBenchmarkValue,
} from '../../../types/product-benchmark';
import { CanDto } from '../../shared/types/normalize';

export class ProductBenchmarkModel
  extends Model
  implements CanDto<ProductBenchmark>
{
  static tableName = 'product_benchmarks';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductBenchmarkKey;
  value?: ProductBenchmarkValue;

  toDto(): ProductBenchmark {
    return {
      id: this.id,
      productId: this.productId,
      source: this.source,
      key: this.key,
      value: this.value,
    };
  }

  getSchema() {
    return productBenchmarkSchema;
  }
}

export type ProductBenchmarkModelPojo =
  PartialModelObject<ProductBenchmarkModel>;
