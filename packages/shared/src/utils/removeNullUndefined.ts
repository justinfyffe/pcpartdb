export function removeNullUndefined<T>(obj: T): T {
  if (obj !== null && typeof obj === 'object') {
    removeNullUndefinedFromObject(obj);
  }
  if (Array.isArray(obj)) {
    removeNullUndefinedFromArray(obj);
  }

  return obj;
}

function removeNullUndefinedFromArray<T>(arr: T[]) {
  for (const val of arr) {
    if (val !== null && typeof val === 'object') {
      removeNullUndefinedFromObject(val);
    }
  }
}

function removeNullUndefinedFromObject<T extends object>(obj: T) {
  Object.entries(obj).forEach(([key, val]) => {
    if (val == null) {
      delete obj[key as keyof T];
    } else {
      removeNullUndefined(val);
    }
  });
}
