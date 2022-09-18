import { Injectable } from '@nestjs/common';
import { ProductImageType } from '../../../types/product-image';
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
      .onConflict(['type', 'product_id', 'image_id'])
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
        .onConflict(['type', 'product_id', 'image_id'])
        .merge()
        .returning('*');
    }

    // Remove images that weren't in the list
    await this.deleteUnusedImages(
      productId,
      ProductImageType.Autocomplete,
      imagesToSave,
      config,
    );
    await this.deleteUnusedImages(
      productId,
      ProductImageType.Thumbnail,
      imagesToSave,
      config,
    );
    await this.deleteUnusedImages(
      productId,
      ProductImageType.Details,
      imagesToSave,
      config,
    );
  }

  private async deleteUnusedImages(
    productId: number,
    type: ProductImageType,
    images: ProductImageModelPojo[],
    config?: RepositoryConfig,
  ) {
    const usedImages = images
      .filter((image) => image.type === type)
      .map((image) => image.imageId!);

    await ProductImageModel.query(config?.trx)
      .where('type', type)
      .where('productId', productId)
      .whereNotIn('imageId', usedImages)
      .delete();
  }
}
