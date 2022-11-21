type SerializeInput<T> =
  | Serializable<T>
  | Serializable<T>[]
  | Map<number, Serializable<T>>;

export interface Serializable<T = unknown> {
  serialize(): T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize<T>(model: SerializeInput<T> | any) {
  if (Array.isArray(model)) {
    return serializeArray(model);
  } else if (model instanceof Map) {
    return serializeMap(model);
  } else if (model != null && typeof model.serialize === 'function') {
    return model.serialize();
  } else {
    return model;
  }
}

export async function serializeAsync<T>(model: Promise<SerializeInput<T>>) {
  return serialize(await model);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeArray<T>(models: (Serializable<T> | any)[]): any[] {
  return models.map((model) => serialize(model));
}

export function serializeMap<T>(models: Map<number, Serializable<T>>) {
  const map = new Map<number, T>();
  models.forEach((model, key) => {
    map.set(key, serialize(model));
  });
  return map;
}
