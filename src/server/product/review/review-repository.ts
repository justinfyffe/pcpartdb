import { RepositoryConfig } from '@server/db/repository';
import { ReviewModel, ReviewModelPojo } from './review-model';

export class ReviewRepository {
  async saveOne(review: ReviewModelPojo, config?: RepositoryConfig) {
    return await ReviewModel.query(config?.trx)
      .insert(review)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }

  async saveMultiple(
    productId: number,
    reviews: ReviewModelPojo[],
    config?: RepositoryConfig,
  ) {
    // Save the reviews
    const reviewsToSave = reviews.map((review) => ({ ...review, productId }));
    if (reviewsToSave.length > 0) {
      await ReviewModel.query(config?.trx)
        .insert(reviewsToSave)
        .onConflict(['product_id', 'key'])
        .merge()
        .returning('*');
    }

    // Remove reviews that weren't in the list

    const usedKeys = reviewsToSave.map((review) => review.key!);
    await ReviewModel.query(config?.trx)
      .where('productId', productId)
      .whereNotIn('key', usedKeys)
      .delete();
  }
}

export const reviewRepository = new ReviewRepository();
