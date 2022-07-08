import { Model, PartialModelObject } from 'objection';
import {
  ProductSpec,
  ProductSpecKey,
  productSpecSchema,
} from '../../../types/product-spec';
import { CanDto } from '../../shared/types/normalize';

export class ProductSpecModel<T = unknown>
  extends Model
  implements CanDto<ProductSpec>
{
  dtoSchema = productSpecSchema;

  static tableName = 'product_specs';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductSpecKey;
  value?: T;

  toDto(): ProductSpec {
    return {
      id: this.id,
      productId: this.productId,
      source: this.source,
      key: this.key,
      value: this.value,
    };
  }
}

export type ProductSpecModelPojo = PartialModelObject<ProductSpecModel>;
