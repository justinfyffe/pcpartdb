import { sleep } from './sleep';

interface ConcurrentOptions {
  limit: number;
  delayBetweenChunksMs?: number;
}

export async function concurrent<T = unknown>(
  promises: Promise<T>[],
  options: ConcurrentOptions,
) {
  const limit = options.limit;
  const chunks: Promise<T>[][] = promises.reduce(
    (acc, promise) => {
      const chunk = acc[acc.length - 1];
      if (chunk.length >= limit) {
        acc.push([promise]);
      } else {
        chunk.push(promise);
      }
      return acc;
    },
    [[]] as Promise<T>[][],
  );

  const results: T[] = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk);
    results.push(...chunkResults);

    if (options.delayBetweenChunksMs) {
      await sleep(options.delayBetweenChunksMs);
    }
  }

  return results;
}
