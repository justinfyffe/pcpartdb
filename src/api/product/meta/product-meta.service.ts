import { Injectable } from '@nestjs/common';
import { ProductMetaKey } from '../../../types/product-meta';
import { ServiceContext } from '../../shared/service/context';
import { ProductMetaRepository } from './product-meta.repository';

@Injectable()
export class ProductMetaService {
  constructor(private metaRepository: ProductMetaRepository) {}

  async autocomplete(
    key: ProductMetaKey,
    value: string | number,
    ctx: ServiceContext,
  ) {
    return await this.metaRepository.findSimilarValue(key, value, ctx);
  }
}
