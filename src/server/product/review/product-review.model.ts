import { Model, PartialModelObject } from 'objection';
import {
  ProductReview,
  ProductReviewKey,
  ProductReviewMetadata,
} from '../../../shared/product-review';
import { Serializable } from '../../shared/types/serialize';

export class ProductReviewModel
  extends Model
  implements Serializable<ProductReview>
{
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

  serialize(): ProductReview {
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
