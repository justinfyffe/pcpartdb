import { throttle } from '@pcpartdb/shared';
import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout: number,
): ((...args: Parameters<T>) => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(throttle(callback, timeout), [callback, timeout]);
};
