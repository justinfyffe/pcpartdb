import { Model, PartialModelObject } from 'objection';
import {
  ProductMeta,
  ProductMetaKey,
  productMetaSchema,
} from '../../../types/product-meta';
import { CanDto } from '../../shared/types/normalize';

export class ProductMetaModel<T = unknown>
  extends Model
  implements CanDto<ProductMeta>
{
  static tableName = 'product_meta';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductMetaKey;
  value?: T;

  toDto(): ProductMeta {
    return {
      source: this.source,
      key: this.key,
      value: this.value,
    };
  }

  getSchema() {
    return productMetaSchema;
  }
}

export type ProductMetaModelPojo = PartialModelObject<ProductMetaModel>;
