import { ServiceContext } from '@server/shared/service/context';
import { ProductMetaKey } from '@shared/product-meta';
import { productMetaRepository } from './product-meta-repository';

export class ProductMetaService {
  async autocomplete(key: ProductMetaKey, value: string, ctx: ServiceContext) {
    return await productMetaRepository.findSimilarValue(key, value, ctx);
  }
}

export const productMetaService = new ProductMetaService();
