import { Model, PartialModelObject } from 'objection';
import { ProductBenchmarkModel } from './benchmark/product-benchmark.model';
import { ProductType } from './product';
import { ProductSpecModel } from './spec/product-spec.model';

export class ProductModel extends Model {
  static tableName = 'products';

  // Fields
  id!: number;
  slug!: string;
  type!: ProductType;
  name!: string;

  // Relations
  specs?: ProductSpecModel[];
  benchmarks?: ProductBenchmarkModel[];

  static relationMappings = {
    specs: {
      relation: Model.HasManyRelation,
      modelClass: ProductSpecModel,
      join: {
        from: 'products.id',
        to: 'product_specs.productId',
      },
    },
    benchmarks: {
      relation: Model.HasManyRelation,
      modelClass: ProductBenchmarkModel,
      join: {
        from: 'products.id',
        to: 'product_benchmarks.productId',
      },
    },
  };
}

export type ProductModelPojo = PartialModelObject<ProductModel>;
