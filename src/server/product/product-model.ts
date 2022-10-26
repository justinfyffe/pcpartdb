import { Serializable } from '@server/shared/types/serialize';
import { Product, ProductType } from '@shared/product';
import { Model, PartialModelObject } from 'objection';
import {
  BenchmarkModel,
  BenchmarkModelPojo,
} from './benchmark/benchmark-model';
import {
  ProductImageModel,
  ProductImageModelPojo,
} from './image/product-image-model';
import {
  ProductMetaModel,
  ProductMetaModelPojo,
} from './meta/product-meta-model';
import { ReviewModel, ReviewModelPojo } from './review/review-model';
import { SpecModel, SpecModelPojo } from './spec/spec-model';

export class ProductModel extends Model implements Serializable<Product> {
  static tableName = 'products';

  // Fields
  id!: number;
  slug!: string;

  type!: ProductType;
  name!: string;

  // Relations
  specs?: SpecModel[];
  benchmarks?: BenchmarkModel[];
  reviews?: ReviewModel[];
  meta?: ProductMetaModel[];
  images?: ProductImageModel[];

  static relationMappings = {
    specs: {
      relation: Model.HasManyRelation,
      modelClass: SpecModel,
      join: {
        from: 'products.id',
        to: 'product_specs.productId',
      },
    },
    benchmarks: {
      relation: Model.HasManyRelation,
      modelClass: BenchmarkModel,
      join: {
        from: 'products.id',
        to: 'product_benchmarks.productId',
      },
    },
    reviews: {
      relation: Model.HasManyRelation,
      modelClass: ReviewModel,
      join: {
        from: 'products.id',
        to: 'product_reviews.productId',
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
    images: {
      relation: Model.HasManyRelation,
      modelClass: ProductImageModel,
      join: {
        from: 'products.id',
        to: 'product_images.productId',
      },
    },
  };

  serialize(): Product {
    return {
      id: this.id,
      slug: this.slug,
      type: this.type,
      name: this.name,

      specs: this.specs?.map((spec) => spec.serialize()) ?? [],
      benchmarks:
        this.benchmarks?.map((benchmark) => benchmark.serialize()) ?? [],
      reviews: this.reviews?.map((review) => review.serialize()) ?? [],

      meta: this.meta?.map((meta) => meta.serialize()) ?? [],
      images: this.images?.map((image) => image.serialize()) ?? [],
    };
  }
}

export type ProductModelPojo = Omit<
  PartialModelObject<ProductModel>,
  'meta' | 'specs' | 'reviews' | 'benchmarks' | 'images'
> & {
  meta: ProductMetaModelPojo[];
  reviews: ReviewModelPojo[];
  specs: SpecModelPojo[];
  benchmarks: BenchmarkModelPojo[];
  images: ProductImageModelPojo[];
};
