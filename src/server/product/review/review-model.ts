import { Serializable } from '@server/shared/types/serialize';
import { Review, ReviewKey, ReviewMetadata } from '@shared/review';
import { Model, PartialModelObject } from 'objection';

export class ReviewModel extends Model implements Serializable<Review> {
  static tableName = 'product_reviews';

  // Fields
  id!: number;
  productId!: number;

  key!: ReviewKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ReviewMetadata;
  source?: string;

  serialize(): Review {
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

export type ReviewModelPojo = PartialModelObject<ReviewModel>;
