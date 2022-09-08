import { Model, PartialModelObject } from 'objection';
import { ProductImage, productImageSchema } from '../../../types/product-image';
import { CanDto } from '../../shared/types/normalize';

export class ProductImageModel extends Model implements CanDto<ProductImage> {
  static tableName = 'product_images';

  // Fields
  productId!: number;
  imageId!: number;

  metadata?: unknown;

  toDto(): ProductImage {
    return {
      productId: this.productId,
      imageId: this.imageId,
      metadata: this.metadata,
    };
  }

  getSchema() {
    return productImageSchema;
  }
}

export type ProductImageModelPojo = PartialModelObject<ProductImageModel>;
