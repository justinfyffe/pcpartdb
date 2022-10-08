import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '@server/db/repository';
import {
  ProductReviewModel,
  ProductReviewModelPojo,
} from './product-review-model';

@Injectable()
export class ProductReviewRepository {
  async saveOne(review: ProductReviewModelPojo, config?: RepositoryConfig) {
    return await ProductReviewModel.query(config?.trx)
      .insert(review)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    reviews: ProductReviewModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the reviews
    const reviewsToSave = reviews.map((review) => ({ ...review, productId }));
    if (reviewsToSave.length > 0) {
      await ProductReviewModel.query(config?.trx)
        .insert(reviewsToSave)
        .onConflict(['product_id', 'key'])
        .merge()
        .returning('*');
    }

    // Remove reviews that weren't in the list

    const usedKeys = reviewsToSave.map((review) => review.key!);
    await ProductReviewModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('key', usedKeys)
      .delete();
  }
}
