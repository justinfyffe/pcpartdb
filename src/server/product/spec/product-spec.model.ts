import { Model, PartialModelObject } from 'objection';
import {
  ProductSpec,
  ProductSpecKey,
  ProductSpecMetadata,
} from '../../../shared/product-spec';
import { Serializable } from '../../shared/types/serialize';

export class ProductSpecModel
  extends Model
  implements Serializable<ProductSpec>
{
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

  serialize(): ProductSpec {
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
