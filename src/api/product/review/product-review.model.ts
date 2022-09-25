import { Model, PartialModelObject } from 'objection';
import {
  ProductReview,
  ProductReviewKey,
  ProductReviewMetadata,
  productReviewSchema,
} from '../../../types/product-review';
import { CanDto } from '../../shared/types/normalize';

export class ProductReviewModel extends Model implements CanDto<ProductReview> {
  static tableName = 'product_reviews';

  // Fields
  id!: number;
  productId!: number;

  key!: ProductReviewKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductReviewMetadata;
  source?: string;

  toDto(): ProductReview {
    return {
      id: this.id,
      productId: this.productId,
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
