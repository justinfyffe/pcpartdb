import { BenchmarkKey, ProductBenchmark } from '@pcpartdb/shared';
import { ProductBenchmarkEntity } from '.';

interface MapToDtoOptions {
  includeBenchmarks?: boolean | BenchmarkKey[];
}

export function mapToProductBenchmarkDto(
  entity: ProductBenchmarkEntity,
  options?: MapToDtoOptions,
) {
  if (entity == null || !options?.includeBenchmarks) {
    return null;
  }

  // If the `includeBenchmarks` is an array, we should only return benchmarks
  // that have a key in it.
  if (
    Array.isArray(options.includeBenchmarks) &&
    !options.includeBenchmarks.includes(entity.benchmarkKey as BenchmarkKey)
  ) {
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

export function mapToProductBenchmarkDtos(
  entities: ProductBenchmarkEntity[],
  options?: MapToDtoOptions,
) {
  if (entities == null) {
    return null;
  }

  return entities
    .map((entity) => mapToProductBenchmarkDto(entity, options))
    .filter((value) => !!value);
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
