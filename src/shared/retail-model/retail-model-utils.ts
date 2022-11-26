import { Product } from '@shared/product';

export function getShoppingUrl(product: Product) {
  return product.metas?.retailModels?.value?.[0]?.amazonUrl ?? null;
}
