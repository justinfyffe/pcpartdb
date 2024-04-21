export function removeEmptyValues<T>(obj: T): T {
  if (obj !== null && typeof obj === 'object') {
    removeEmptyValuesFromObject(obj);
  }
  if (obj !== null && Array.isArray(obj)) {
    removeEmptyValuesFromArray(obj);
  }

  return obj;
}

function removeEmptyValuesFromArray<T>(arr: T[]) {
  for (const val of arr) {
    removeEmptyValues(val);
  }
}

function removeEmptyValuesFromObject<T extends object>(obj: T) {
  Object.entries(obj).forEach(([key, val]) => {
    if (val == null || val === '') {
      delete obj[key as keyof T];
    } else {
      removeEmptyValues(val);
    }
  });
}
