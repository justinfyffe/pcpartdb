import { debounce } from '@pcpartdb/shared';
import { useCallback, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout: number,
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fn = useMemo(() => debounce(callback, timeout), [callback, timeout]);
  return useCallback(fn, [fn]);
}
