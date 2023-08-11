/**
 * Executes the ${callback} unless another one has happened during the timeout
 * period. At the end of the timeout period, the most recent uncalled callback
 * will be executed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout: number,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  let lastRunTime: number;

  return (...args: Parameters<T>) => {
    if (lastRunTime == null) {
      callback(...args);
      lastRunTime = Date.now();
    } else {
      clearTimeout(timer);
      const timeSinceLastRun = Date.now() - lastRunTime;
      if (timeSinceLastRun >= timeout) {
        callback(...args);
      } else {
        timer = setTimeout(() => {
          callback(...args);
        }, Math.max(timeout - timeSinceLastRun, 0));
      }
    }
  };
};
