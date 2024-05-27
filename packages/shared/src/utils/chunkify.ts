interface ChunkifyUsingChunkSizeOptions {
  chunkSize: number;
}

interface ChunkifyUsingTotalChunksOptions {
  totalChunks: number;
}

type ChunkifyOptions =
  | ChunkifyUsingChunkSizeOptions
  | ChunkifyUsingTotalChunksOptions;

export function chunkify<T = unknown>(arr: T[], options: ChunkifyOptions) {
  let chunkSize;
  if ('chunkSize' in options) {
    chunkSize = options.chunkSize;
  } else if ('totalChunks' in options) {
    chunkSize = Math.ceil(arr.length / options.totalChunks);
  }

  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}
