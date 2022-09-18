import { Model, PartialModelObject } from 'objection';
import {
  ProductImage,
  productImageSchema,
  ProductImageType,
} from '../../../types/product-image';
import { ImageModel } from '../../images/image.model';
import { CanDto } from '../../shared/types/normalize';

export class ProductImageModel extends Model implements CanDto<ProductImage> {
  static tableName = 'product_images';

  // Fields
  id!: number;
  type!: ProductImageType;
  productId!: number;
  imageId!: number;

  // Relations
  image?: ImageModel;

  static relationMappings = {
    image: {
      relation: Model.BelongsToOneRelation,
      modelClass: ImageModel,
      join: {
        from: 'product_images.imageId',
        to: 'images.id',
      },
    },
  };

  toDto(): ProductImage {
    return {
      id: this.id,
      type: this.type,
      productId: this.productId,
      imageId: this.imageId,

      image: this.image?.toDto(),
    };
  }

  getSchema() {
    return productImageSchema;
  }
}

export type ProductImageModelPojo = Omit<
  PartialModelObject<ProductImageModel>,
  'image'
>;
