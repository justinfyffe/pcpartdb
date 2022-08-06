import { Model, PartialModelObject } from 'objection';
import { Product, productSchema, ProductType } from '../../types/product';
import { CanDto } from '../shared/types/normalize';
import { ProductBenchmarkModel } from './benchmark/product-benchmark.model';
import { ProductMetaModel } from './meta/product-meta.model';
import { ProductReviewModel } from './review/product-review.model';
import { ProductSpecModel } from './spec/product-spec.model';

export class ProductModel extends Model implements CanDto<Product> {
  static tableName = 'products';

  // Fields
  id!: number;
  slug!: string;
  type!: ProductType;
  name!: string;

  // Relations
  meta?: ProductMetaModel[];
  specs?: ProductSpecModel[];
  benchmarks?: ProductBenchmarkModel[];
  reviews?: ProductReviewModel[];

  static relationMappings = {
    meta: {
      relation: Model.HasManyRelation,
      modelClass: ProductMetaModel,
      join: {
        from: 'products.id',
        to: 'product_meta.productId',
      },
    },
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
    reviews: {
      relation: Model.HasManyRelation,
      modelClass: ProductReviewModel,
      join: {
        from: 'products.id',
        to: 'product_reviews.productId',
      },
    },
  };

  toDto(): Product {
    return {
      id: this.id,
      slug: this.slug,
      type: this.type,
      name: this.name,

      meta: this.meta?.map((meta) => meta.toDto()) ?? [],
      specs: this.specs?.map((spec) => spec.toDto()) ?? [],
      benchmarks: this.benchmarks?.map((benchmark) => benchmark.toDto()) ?? [],
      reviews: this.reviews?.map((review) => review.toDto()) ?? [],
    };
  }

  getSchema() {
    return productSchema;
  }
}

export type ProductModelPojo = PartialModelObject<ProductModel>;
