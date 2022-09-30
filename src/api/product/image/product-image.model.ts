import { Model, PartialModelObject } from 'objection';
import {
  ProductImage,
  ProductImageMetadata,
  ProductImageType,
} from '../../../types/product-image';
import { ImageModel } from '../../images/image.model';

export class ProductImageModel extends Model {
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
      type: this.type,
      imageId: this.imageId,
      metadata: this.metadata,

      image: this.image?.toDto(),
    };
  }
}

export type ProductImageModelPojo = Omit<
  PartialModelObject<ProductImageModel>,
  'image'
>;
