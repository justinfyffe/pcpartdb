import { Model, PartialModelObject } from 'objection';
import { Product, productSchema, ProductType } from '../../types/product';
import { CanDto } from '../shared/types/normalize';
import { ProductBenchmarkModel } from './benchmark/product-benchmark.model';
import { ProductSpecModel } from './spec/product-spec.model';

export class ProductModel extends Model implements CanDto<Product> {
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

  toDto(): Product {
    return {
      id: this.id,
      slug: this.slug,
      type: this.type,
      name: this.name,

      specs: this.specs?.map((spec) => spec.toDto()) ?? [],
      benchmarks: this.benchmarks?.map((benchmark) => benchmark.toDto()) ?? [],
    };
  }

  getSchema() {
    return productSchema;
  }
}

export type ProductModelPojo = PartialModelObject<ProductModel>;
