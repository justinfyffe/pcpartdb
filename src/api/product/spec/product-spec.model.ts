import { Model, PartialModelObject } from 'objection';
import {
  ProductSpec,
  ProductSpecKey,
  ProductSpecMetadata,
} from '../../../types/product-spec';

export class ProductSpecModel extends Model {
  static tableName = 'product_specs';

  // Fields
  id!: number;
  productId!: number;

  key!: ProductSpecKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductSpecMetadata;
  source?: string;

  toDto(): ProductSpec {
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

export type ProductSpecModelPojo = PartialModelObject<ProductSpecModel>;
