import { ProductSource } from '@pcpartdb/shared';
import { ProductSourceEntity } from '../product';

export function mapToProductSourceDto(row: ProductSourceEntity): ProductSource {
  if (row == null) {
    return null;
  }

  return {
    id: row.id,
    productType: row.productType,
  };
}

export function mapToProductSourceEntity(
  productSource: Partial<ProductSource>,
): ProductSourceEntity {
  if (productSource == null) {
    return null;
  }

  return {
    id: undefined,
  };
}
