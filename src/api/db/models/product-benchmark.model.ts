import { Model, PartialModelObject } from 'objection';
import { ProductBenchmarkKey } from '../../product/benchmark/product-benchmark';

export class ProductBenchmarkModel<T = unknown> extends Model {
  static tableName = 'product_benchmarks';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductBenchmarkKey;
  value?: T;
}

export type ProductBenchmarkModelPojo =
  PartialModelObject<ProductBenchmarkModel>;
