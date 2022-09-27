import { Model, PartialModelObject } from 'objection';
import {
  ProductReview,
  ProductReviewKey,
  ProductReviewMetadata,
} from '../../../types/product-review';

export class ProductReviewModel extends Model {
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
      key: this.key,
      integerValue: this.integerValue,
      floatValue: this.floatValue,
      booleanValue: this.booleanValue,
      stringValue: this.stringValue,
      textValue: this.textValue,
      jsonValue: this.jsonValue,
      metadata: this.metadata,
      source: this.source,
    };
  }
}

export type ProductReviewModelPojo = PartialModelObject<ProductReviewModel>;
