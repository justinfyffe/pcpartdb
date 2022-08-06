import { Model, PartialModelObject } from 'objection';
import {
  ProductReview,
  ProductReviewKey,
  productReviewSchema,
} from '../../../types/product-review';
import { CanDto } from '../../shared/types/normalize';

export class ProductReviewModel<T = unknown>
  extends Model
  implements CanDto<ProductReview>
{
  static tableName = 'product_reviews';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductReviewKey;
  value?: T;

  toDto(): ProductReview {
    return {
      source: this.source,
      key: this.key,
      value: this.value,
    };
  }

  getSchema() {
    return productReviewSchema;
  }
}

export type ProductReviewModelPojo = PartialModelObject<ProductReviewModel>;
