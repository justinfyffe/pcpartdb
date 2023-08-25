import { sleep } from './sleep';

export type ConcurrentFn<T = unknown> = () => Promise<T>;

interface ConcurrentOptions {
  limit: number;
  delayBetweenChunksMs?: number;
}

export async function concurrent<T = unknown>(
  promiseFns: ConcurrentFn<T>[],
  options: ConcurrentOptions,
) {
  const limit = options.limit;
  const chunks: ConcurrentFn<T>[][] = promiseFns.reduce(
    (acc, promiseFn) => {
      const chunk = acc[acc.length - 1];
      if (chunk.length >= limit) {
        acc.push([promiseFn]);
      } else {
        chunk.push(promiseFn);
      }
      return acc;
    },
    [[]] as ConcurrentFn<T>[][],
  );

  const results: T[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map((fn) => fn()));
    results.push(...chunkResults);

    if (options.delayBetweenChunksMs) {
      await sleep(options.delayBetweenChunksMs);
    }
  }

  return results;
}
