import { Model, PartialModelObject } from 'objection';
import {
  ProductMeta,
  ProductMetaKey,
  ProductMetaMetadata,
} from '../../../types/product-meta';
import { Serializable } from '../../shared/types/serialize';

export class ProductMetaModel
  extends Model
  implements Serializable<ProductMeta>
{
  static tableName = 'product_meta';

  // Fields
  id!: number;
  productId!: number;

  key!: ProductMetaKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductMetaMetadata;
  source?: string;

  serialize(): ProductMeta {
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

export type ProductMetaModelPojo = PartialModelObject<ProductMetaModel>;
