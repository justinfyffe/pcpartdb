import { ProductSource, ProductSourceKey, ProductType } from '@pcpartdb/shared';
import { ProductSourceEntity } from '../product';

export function mapToProductSourceDto(row: ProductSourceEntity): ProductSource {
  if (row == null) {
    return null;
  }

  return {
    id: row.id,
    productType: row.productType as ProductType,
    productName: row.productName,
    productCompany: row.productCompany,
    sourceKey: row.sourceKey as ProductSourceKey,
    sourceUrl: row.sourceUrl,
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
    productType: productSource.productType,
    productName: productSource.productName,
    productCompany: productSource.productCompany,
    sourceKey: productSource.sourceKey,
    sourceUrl: productSource.sourceUrl,
    createdAt: undefined,
    updatedAt: undefined,
  };
}
