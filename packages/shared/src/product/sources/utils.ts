import { Product } from '../common';
import { ProductSourceKey } from './common';

export function hasProductSource(
  product: Product,
  sourceKey: ProductSourceKey,
) {
  return productSourceUrl(product, sourceKey) != null;
}

export function getProductSource(
  product: Product,
  sourceKey: ProductSourceKey,
) {
  return (
    product?.sources?.filter((source) => source.sourceKey === sourceKey)?.[0] ||
    null
  );
}

export function productSourceUrl(
  product: Product,
  sourceKey: ProductSourceKey,
) {
  return getProductSource(product, sourceKey)?.sourceUrl;
}
