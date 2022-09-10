import { Model, PartialModelObject } from 'objection';
import { Product, productSchema, ProductType } from '../../types/product';
import { CanDto } from '../shared/types/normalize';
import {
  ProductBenchmarkModel,
  ProductBenchmarkModelPojo,
} from './benchmark/product-benchmark.model';
import {
  ProductMetaModel,
  ProductMetaModelPojo,
} from './meta/product-meta.model';
import {
  ProductReviewModel,
  ProductReviewModelPojo,
} from './review/product-review.model';
import {
  ProductSpecModel,
  ProductSpecModelPojo,
} from './spec/product-spec.model';

export class ProductModel extends Model implements CanDto<Product> {
  static tableName = 'products';

  // Fields
  id!: number;
  slug!: string;

  // Parent = Main Model (e.g. RTX 3070)
  // Child = Variant of model (e.g. RTX 3070 Gaming OC)
  parentId?: number;

  type!: ProductType;
  name!: string;

  // Relations
  parent?: ProductModel;
  meta?: ProductMetaModel[];
  specs?: ProductSpecModel[];
  benchmarks?: ProductBenchmarkModel[];
  reviews?: ProductReviewModel[];

  static relationMappings = {
    parent: {
      relation: Model.BelongsToOneRelation,
      modelClass: ProductModel,
      join: {
        from: 'products.parentId',
        to: 'products.id',
      },
    },
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
      parentId: this.parentId,
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

export type ProductModelPojo = Omit<
  PartialModelObject<ProductModel>,
  'parent' | 'meta' | 'specs' | 'reviews' | 'benchmarks'
> & {
  meta: ProductMetaModelPojo[];
  reviews: ProductReviewModelPojo[];
  specs: ProductSpecModelPojo[];
  benchmarks: ProductBenchmarkModelPojo[];
};
