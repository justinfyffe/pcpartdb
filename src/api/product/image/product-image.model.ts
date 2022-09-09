import { Model, PartialModelObject } from 'objection';
import {
  ProductImage,
  ProductImageMetadata,
  productImageSchema,
  ProductImageType,
} from '../../../types/product-image';
import { ImageModel } from '../../images/image.model';
import { CanDto } from '../../shared/types/normalize';

export class ProductImageModel extends Model implements CanDto<ProductImage> {
  static tableName = 'product_images';

  // Fields
  id!: number;

  productId!: number;
  type!: ProductImageType;
  imageId!: number;

  metadata: ProductImageMetadata;

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
      productId: this.productId,
      type: this.type,
      imageId: this.imageId,
      metadata: this.metadata,

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
