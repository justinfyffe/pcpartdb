import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../shared/file';

const GPU_UPDATER_DATA_PATH = dataPath('gpu-updater');

if (!fs.existsSync(GPU_UPDATER_DATA_PATH)) {
  fs.mkdirSync(GPU_UPDATER_DATA_PATH, { recursive: true });
}

export function gpuUpdaterDataPath(file?: string) {
  return file != null
    ? path.join(GPU_UPDATER_DATA_PATH, file)
    : GPU_UPDATER_DATA_PATH;
}
