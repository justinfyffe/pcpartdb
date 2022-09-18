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
  productId!: number;
  imageId!: number;
  type!: ProductImageType;

  // Relations
  image?: ImageModel;

  static relationMappings = {
    image: {
      relation: Model.BelongsToOneRelation,
      modelClass: ImageModel,
      join: {
        from: 'productImages.imageId',
        to: 'images.id',
      },
    },
  };

  toDto(): ProductImage {
    return {
      productId: this.productId,
      imageId: this.imageId,
      type: this.type,

      image: this.image?.toDto(),
    };
  }

  getSchema() {
    return productImageSchema;
  }
}

export type ProductImageModelPojo = PartialModelObject<ProductImageModel>;
