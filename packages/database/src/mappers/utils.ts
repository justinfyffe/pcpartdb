import * as zlib from 'zlib';

export async function gzipData<T = unknown>(data: T) {
  return await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(Buffer.from(JSON.stringify(data)), (err, result) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function unzipData<T = unknown>(data: Buffer) {
  return await new Promise<T>((resolve, reject) => {
    zlib.gunzip(data, (err, result) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(JSON.parse(result.toString('utf-8')) as T);
      }
    });
  });
}
