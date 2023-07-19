import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../../shared/file';

const AUTOMATION_DATA_PATH = dataPath('automation');

if (!fs.existsSync(AUTOMATION_DATA_PATH)) {
  fs.mkdirSync(AUTOMATION_DATA_PATH, { recursive: true });
}

export function automationDataPath(file?: string) {
  return file != null
    ? path.join(AUTOMATION_DATA_PATH, file)
    : AUTOMATION_DATA_PATH;
}
