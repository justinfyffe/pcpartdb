import * as fs from 'fs';
import path from 'path';
import { dataPath } from '../../shared/file';

const AUTOPILOT_DATA_PATH = dataPath('autopilot');

if (!fs.existsSync(AUTOPILOT_DATA_PATH)) {
  fs.mkdirSync(AUTOPILOT_DATA_PATH, { recursive: true });
}

export function autopilotDataPath(file?: string) {
  return file != null
    ? path.join(AUTOPILOT_DATA_PATH, file)
    : AUTOPILOT_DATA_PATH;
}
