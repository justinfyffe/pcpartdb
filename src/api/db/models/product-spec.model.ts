import { Model, PartialModelObject } from 'objection';
import { ProductSpecKey } from '../../product/spec/product-spec';

export class ProductSpecModel<T = unknown> extends Model {
  static tableName = 'product_specs';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductSpecKey;
  value?: T;
}

export type ProductSpecModelPojo = PartialModelObject<ProductSpecModel>;
