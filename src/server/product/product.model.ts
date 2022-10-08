import { Model, PartialModelObject } from 'objection';
import { Product, ProductType } from '../../shared/product';
import { Serializable } from '../shared/types/serialize';
import {
  ProductBenchmarkModel,
  ProductBenchmarkModelPojo,
} from './benchmark/product-benchmark.model';
import {
  ProductImageModel,
  ProductImageModelPojo,
} from './image/product-image.model';
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

export class ProductModel extends Model implements Serializable<Product> {
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
  images?: ProductImageModel[];

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

      meta: this.meta?.map((meta) => meta.serialize()) ?? [],
      specs: this.specs?.map((spec) => spec.serialize()) ?? [],
      benchmarks:
        this.benchmarks?.map((benchmark) => benchmark.serialize()) ?? [],
      reviews: this.reviews?.map((review) => review.serialize()) ?? [],
      images: this.images?.map((image) => image.serialize()) ?? [],
    };
  }
}

export type ProductModelPojo = Omit<
  PartialModelObject<ProductModel>,
  'meta' | 'specs' | 'reviews' | 'benchmarks' | 'images'
> & {
  meta: ProductMetaModelPojo[];
  reviews: ProductReviewModelPojo[];
  specs: ProductSpecModelPojo[];
  benchmarks: ProductBenchmarkModelPojo[];
  images: ProductImageModelPojo[];
};
