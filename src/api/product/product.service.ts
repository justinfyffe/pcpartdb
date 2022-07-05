import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProductBySlug(slug: string) {
    return await this.productRepository.findBySlug(slug);
  }
}
