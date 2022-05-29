import { Model, PartialModelObject } from 'objection';
import { ProductBenchmarkKey } from '../../product';

export class ProductBenchmarkModel extends Model {
  static tableName = 'product_benchmarks';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductBenchmarkKey;
  value!: string;
  overwrittenValue?: string;
}

export type ProductBenchmarkModelPojo =
  PartialModelObject<ProductBenchmarkModel>;
