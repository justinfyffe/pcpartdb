import * as fs from 'fs';
import path from 'path';

const CWD_PATH = path.resolve(process.cwd());

const DATA_PATH = path.join(CWD_PATH, 'data');

if (!fs.existsSync(DATA_PATH)) {
  fs.mkdirSync(DATA_PATH, { recursive: true });
}

export function dataPath(file?: string) {
  return file != null ? path.join(DATA_PATH, file) : DATA_PATH;
}

export async function createFolder(folder: string) {
  await fs.promises.mkdir(folder, { recursive: true });
}
