import { Injectable } from '@nestjs/common';
import { RepositoryConfig } from '../../db/repository';
import {
  ProductReviewModel,
  ProductReviewModelPojo,
} from './product-review.model';

@Injectable()
export class ProductReviewRepository {
  async save(review: ProductReviewModelPojo, config?: RepositoryConfig) {
    return await ProductReviewModel.query(config?.trx)
      .insert(review)
      .onConflict(['productId', 'key'])
      .merge()
      .returning('*');
  }
}
