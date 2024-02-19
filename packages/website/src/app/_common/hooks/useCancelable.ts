import { useCallback, useState } from 'react';

export function useCancelable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (arg: any, requestInit?: RequestInit) => ReturnType<T>,
>(callback: T) {
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const func = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (arg: any, requestInit?: RequestInit) => {
      const controller = new AbortController();
      setAbortController(controller);
      const config = { ...(requestInit ?? {}), signal: controller.signal };
      callback(arg, config);
    },
    [callback],
  );

  const abort = useCallback(() => {
    abortController?.abort();
  }, [abortController]);

  return { func, abort };
}
