import { Model, PartialModelObject } from 'objection';
import {
  ProductImage,
  ProductImageMetadata,
  ProductImageType,
} from '../../../types/product-image';
import { ImageModel } from '../../images/image.model';
import { Serializable } from '../../shared/types/serialize';

export class ProductImageModel
  extends Model
  implements Serializable<ProductImage>
{
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

  serialize(): ProductImage {
    return {
      type: this.type,
      imageId: this.imageId,
      metadata: this.metadata,

      image: this.image?.serialize(),
    };
  }
}

export type ProductImageModelPojo = Omit<
  PartialModelObject<ProductImageModel>,
  'image'
>;
