import * as normalizr from 'normalizr';

export interface CanDto<T = unknown> {
  dtoSchema: normalizr.Schema;

  toDto(): T;
}

export function normalize<T>(
  entities: CanDto<T> | CanDto<T>[] | Map<number, CanDto<T>>,
) {
  if (Array.isArray(entities)) {
    return normalizeArray(entities);
  } else if (entities instanceof Map) {
    return normalizeMap(entities);
  } else {
    return normalizr.normalize(entities.toDto(), entities.dtoSchema);
  }
}

function normalizeArray<T>(entities: CanDto<T>[]) {
  if (entities.length === 0) {
    return {};
  }

  const dtos = entities.map((entity) => entity.toDto());
  return normalizr.normalize(dtos, [entities[0].dtoSchema]);
}

function normalizeMap<T>(entities: Map<number, CanDto<T>>) {
  return normalizeArray(Array.from(entities.values()));
}
