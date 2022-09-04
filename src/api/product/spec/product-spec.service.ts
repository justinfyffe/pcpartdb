import { Injectable } from '@nestjs/common';
import { ProductSpecKey } from '../../../types/product-spec';
import { ServiceContext } from '../../shared/service/context';
import { ProductSpecRepository } from './product-spec.repository';

@Injectable()
export class ProductSpecService {
  constructor(private specRepository: ProductSpecRepository) {}

  async autocomplete(key: ProductSpecKey, value: string, ctx: ServiceContext) {
    return await this.specRepository.findSimilarValue(key, value, ctx);
  }
}
