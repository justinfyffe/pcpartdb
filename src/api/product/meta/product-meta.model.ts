import { Model, PartialModelObject } from 'objection';
import {
  ProductMeta,
  ProductMetaKey,
  ProductMetaMetadata,
  productMetaSchema,
} from '../../../types/product-meta';
import { CanDto } from '../../shared/types/normalize';

export class ProductMetaModel extends Model implements CanDto<ProductMeta> {
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

  toDto(): ProductMeta {
    return {
      id: this.id,
      productId: this.productId,
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

  getSchema() {
    return productMetaSchema;
  }
}

export type ProductMetaModelPojo = PartialModelObject<ProductMetaModel>;
