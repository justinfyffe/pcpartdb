import { useCallback, useState } from 'react';
import { RequestConfig } from '../api/types';

export const useCancelable = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (arg: any, requestConfig?: RequestConfig) => ReturnType<T>,
>(
  callback: T,
) => {
  const [abortController, setAbortController] = useState<AbortController>(null);

  const func = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arg: any, requestConfig?: RequestConfig) => {
      const controller = new AbortController();
      setAbortController(controller);
      const config = { ...(requestConfig ?? {}), signal: controller.signal };
      callback(arg, config);
    },
    [callback],
  );

  const abort = useCallback(() => {
    abortController?.abort();
  }, [abortController]);

  return { func, abort };
};
