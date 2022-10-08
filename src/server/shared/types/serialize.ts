type SerializeInput<T> =
  | Serializable<T>
  | Serializable<T>[]
  | Map<number, Serializable<T>>;

export interface Serializable<T = unknown> {
  serialize(): T;
}

export function serialize<T>(model: SerializeInput<T>) {
  if (Array.isArray(model)) {
    return serializeArray(model);
  } else if (model instanceof Map) {
    return serializeMap(model);
  } else {
    return model.serialize();
  }
}

export async function serializeAsync<T>(model: Promise<SerializeInput<T>>) {
  return serialize(await model);
}

function serializeArray<T>(models: Serializable<T>[]) {
  return models.map((model) => model.serialize());
}

function serializeMap<T>(models: Map<number, Serializable<T>>) {
  const map = new Map<number, T>();
  models.forEach((model, key) => {
    map.set(key, model.serialize());
  });
  return map;
}
