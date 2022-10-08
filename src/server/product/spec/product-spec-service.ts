import { Injectable } from '@nestjs/common';
import { ServiceContext } from '@server/shared/service/context';
import { ProductSpecKey } from '@shared/product-spec';
import { ProductSpecRepository } from './product-spec-repository';

@Injectable()
export class ProductSpecService {
  constructor(private specRepository: ProductSpecRepository) {}

  async autocomplete(key: ProductSpecKey, value: string, ctx: ServiceContext) {
    return await this.specRepository.findSimilarValue(key, value, ctx);
  }
}
