import { Injectable } from '@nestjs/common';
import { ServiceContext } from '@server/shared/service/context';
import { ProductMetaKey } from '@shared/product-meta';
import { ProductMetaRepository } from './product-meta-repository';

@Injectable()
export class ProductMetaService {
  constructor(private metaRepository: ProductMetaRepository) {}

  async autocomplete(key: ProductMetaKey, value: string, ctx: ServiceContext) {
    return await this.metaRepository.findSimilarValue(key, value, ctx);
  }
}
