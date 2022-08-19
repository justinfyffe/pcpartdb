import { Model, PartialModelObject } from 'objection';
import {
  ProductReview,
  ProductReviewKey,
  productReviewSchema,
  ProductReviewValue,
} from '../../../types/product-review';
import { CanDto } from '../../shared/types/normalize';

export class ProductReviewModel extends Model implements CanDto<ProductReview> {
  static tableName = 'product_reviews';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductReviewKey;
  value?: ProductReviewValue;

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
