import { Model, PartialModelObject } from 'objection';
import {
  ProductSpec,
  ProductSpecKey,
  ProductSpecMetadata,
  productSpecSchema,
} from '../../../types/product-spec';
import { CanDto } from '../../shared/types/normalize';

export class ProductSpecModel extends Model implements CanDto<ProductSpec> {
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
    return productSpecSchema;
  }
}

export type ProductSpecModelPojo = PartialModelObject<ProductSpecModel>;
