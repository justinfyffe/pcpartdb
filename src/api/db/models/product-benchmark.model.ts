import { Model, PartialModelObject } from 'objection';
import { ProductBenchmarkKey } from '../../product';

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
