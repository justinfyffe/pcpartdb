import { ProductSource, ProductSourceKey, ProductType } from '@pcpartdb/shared';
import { ProductSourceEntity } from '../product';

export function mapToProductSourceDto(row: ProductSourceEntity): ProductSource {
  if (row == null) {
    return null;
  }

  return {
    id: row.id,
    productType: row.productType as ProductType,
    sourceName: row.sourceName,
    sourceKey: row.sourceKey as ProductSourceKey,
    sourceUrl: row.sourceUrl,
    archived: row.archived,
  };
}

export function mapToProductSourceDtos(entities: ProductSourceEntity[]) {
  const ret: ProductSource[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(mapToProductSourceDto(entities[i]));
  }
  return ret;
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
    sourceName: productSource.sourceName,
    sourceKey: productSource.sourceKey,
    sourceUrl: productSource.sourceUrl,
    archived: productSource.archived,
    createdAt: undefined,
    updatedAt: undefined,
  };
}
