import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '../../db/repository';
import {
  ProductImageModel,
  ProductImageModelPojo,
} from './product-image.model';

@Injectable()
export class ProductImageRepository {
  async saveOne(image: ProductImageModelPojo, config?: RepositoryConfig) {
    return await ProductImageModel.query(config?.trx)
      .insert(image)
      .onConflict(['product_id', 'image_id'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    images: ProductImageModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the images
    const imagesToSave = images.map((image) => ({
      ...image,
      productId,
    }));
    if (imagesToSave.length > 0) {
      await ProductImageModel.query(config?.trx)
        .insert(imagesToSave)
        .onConflict(['product_id', 'image_id'])
        .merge()
        .returning('*');
    }

    // Remove images that weren't in the list
    const usedImages = imagesToSave.map((image) => image.imageId!);
    await ProductImageModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('imageId', usedImages)
      .delete();
  }
}
