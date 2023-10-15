import * as fsPromises from 'fs/promises';
import { dataPath } from '../shared/file';

export async function postDeployment() {
  // Clear file cache
  const cachePath = dataPath('api/cache');
  await fsPromises.rm(cachePath, { recursive: true, force: true });
  await fsPromises.mkdir(cachePath);
}
