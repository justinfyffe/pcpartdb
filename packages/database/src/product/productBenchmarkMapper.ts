import { ProductBenchmark } from '@pcpartdb/shared';
import { ProductBenchmarkEntity } from '.';

export function mapToProductBenchmarkDto(entity: ProductBenchmarkEntity) {
  if (entity == null) {
    return null;
  }

  return {
    productId: entity.productId,
    benchmarkKey: entity.benchmarkKey,
    value: entity.value,
    valuePerMsrp: entity.valuePerMsrp,
    metadata: entity.metadata,
  } as ProductBenchmark;
}

export function mapToProductBenchmarkDtos(entities: ProductBenchmarkEntity[]) {
  if (entities == null) {
    return null;
  }

  return entities.map((entity) => mapToProductBenchmarkDto(entity));
}

export function mapToProductBenchmarkEntity(dto: ProductBenchmark) {
  if (dto == null) {
    return null;
  }

  return {
    productId: undefined,
    benchmarkKey: dto.benchmarkKey,
    value: dto.value,
    valuePerMsrp: dto.valuePerMsrp,
    metadata: dto.metadata,
  } as ProductBenchmarkEntity;
}
