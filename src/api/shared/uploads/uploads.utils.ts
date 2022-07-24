import * as fs from 'fs';
import path from 'path';

const UPLOADS_PATH = path.join(__dirname, '../../../..', 'uploads');
const TMP_PATH = path.join(UPLOADS_PATH, 'tmp');
const IMAGES_PATH = path.join(UPLOADS_PATH, 'images');

if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH);
}
if (!fs.existsSync(TMP_PATH)) {
  fs.mkdirSync(TMP_PATH);
}
if (!fs.existsSync(IMAGES_PATH)) {
  fs.mkdirSync(IMAGES_PATH);
}

export function tmpPath(file?: string) {
  return file != null ? path.join(TMP_PATH, file) : TMP_PATH;
}

export function imagePath(file?: string) {
  return file != null ? path.join(IMAGES_PATH, file) : IMAGES_PATH;
}

export async function exists(file: string) {
  return fs.existsSync(file);
}

export async function stats(file: string) {
  return await fs.promises.stat(file);
}

export async function copy(src: string, dest: string) {
  await fs.promises.copyFile(src, dest);
}

export async function move(src: string, dest: string) {
  await fs.promises.rename(src, dest);
}

export async function remove(file: string) {
  await fs.promises.rm(file);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateTmpFilename(file: any) {
  return `${Math.floor(
    Math.random() * 10000000,
  )}-${new Date().getTime()}${path.extname(file.originalname)}`;
}
