export async function throttlePromises<T>(
  promises: Promise<T>[],
  limit: number,
) {
  const results: T[] = [];

  const chunk: Promise<T>[] = [];
  for (let i = 0; i < promises.length; ++i) {
    chunk.push(promises[i]);

    if (i === promises.length - 1 || chunk.length === limit) {
      const chunkResults = await Promise.all(chunk);
      results.push(...chunkResults);
    }
  }

  return results;
}
