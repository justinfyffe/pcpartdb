export function sortByIds<TId = unknown, TObject = unknown>(
  ids: TId[],
  list: TObject[],
  idFunc: (obj: TObject) => TId,
  excludeNulls?: boolean,
) {
  const map = new Map<TId, TObject>();
  for (const id of ids) {
    map.set(id, null);
  }
  for (const obj of list) {
    map.set(idFunc(obj), obj);
  }
  return [...map.values()].filter((value) =>
    excludeNulls ? value != null : true,
  );
}
