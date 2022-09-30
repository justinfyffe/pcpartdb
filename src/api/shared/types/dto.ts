export interface CanDto<T = unknown> {
  toDto(): T;
}

export function dto<T>(
  model: CanDto<T> | CanDto<T>[] | Map<number, CanDto<T>>,
) {
  if (Array.isArray(model)) {
    return dtoArray(model);
  } else if (model instanceof Map) {
    return dtoMap(model);
  } else {
    return model.toDto();
  }
}

function dtoArray<T>(models: CanDto<T>[]) {
  return models.map((model) => model.toDto());
}

function dtoMap<T>(models: Map<number, CanDto<T>>) {
  const map = new Map<number, T>();
  models.forEach((model, key) => {
    map.set(key, model.toDto());
  });
  return map;
}
