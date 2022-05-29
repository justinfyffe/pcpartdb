import { Model, PartialModelObject } from 'objection';
import { ProductSpecKey } from '../../product';

export class ProductSpecModel extends Model {
  static tableName = 'product_specs';

  // Fields
  id!: number;
  productId!: number;

  source?: string;
  key!: ProductSpecKey;
  value!: string;
  overwrittenValue?: string;
}

export type ProductSpecModelPojo = PartialModelObject<ProductSpecModel>;
