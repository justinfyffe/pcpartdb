import * as fs from 'fs';
import multer, { diskStorage } from 'multer';
import path from 'path';

const CWD_PATH = path.resolve(process.cwd());

const TMP_PATH = path.join(CWD_PATH, 'tmp');
const WEBSITE_PATH = path.join(CWD_PATH, '../website');

const UPLOADS_PATH = path.join(TMP_PATH, 'uploads');
const EXPORTS_PATH = path.join(TMP_PATH, 'exports');
const PUBLIC_IMAGES_PATH = path.join(WEBSITE_PATH, 'public/u/images');

if (!fs.existsSync(TMP_PATH)) {
  fs.mkdirSync(TMP_PATH, { recursive: true });
}
if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
}
if (!fs.existsSync(EXPORTS_PATH)) {
  fs.mkdirSync(EXPORTS_PATH, { recursive: true });
}
if (!fs.existsSync(PUBLIC_IMAGES_PATH)) {
  fs.mkdirSync(PUBLIC_IMAGES_PATH, { recursive: true });
}

export const MULTER_OPTIONS: multer.Options = {
  storage: diskStorage({
    destination: uploadsPath(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: (req: any, file: any, cb: any) => {
      const tempPath = generateUploadTmpFilename(file);
      req.body.tempPath = tempPath;
      cb(null, tempPath);
    },
  }),
};

export function tmpPath(file?: string) {
  return file != null ? path.join(TMP_PATH, file) : TMP_PATH;
}

export function uploadsPath(file?: string) {
  return file != null ? path.join(UPLOADS_PATH, file) : UPLOADS_PATH;
}

export function exportsPath(file?: string) {
  return file != null ? path.join(EXPORTS_PATH, file) : EXPORTS_PATH;
}

export function imagePath(file?: string) {
  return file != null
    ? path.join(PUBLIC_IMAGES_PATH, file)
    : PUBLIC_IMAGES_PATH;
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

export async function createFolder(folder: string) {
  await fs.promises.mkdir(folder, { recursive: true });
}

export async function removeFolder(folder: string) {
  await fs.promises.rm(folder, { recursive: true });
}

export function generateRandomName(prefix?: string, ext?: string) {
  let fileName = `${Math.floor(
    Math.random() * 10000000,
  )}-${new Date().getTime()}`;

  if (prefix != null) {
    fileName = `${prefix}-${fileName}`;
  }
  if (ext != null) {
    fileName = `${fileName}.${ext}`;
  }
  return fileName;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateUploadTmpFilename(file: any) {
  return `${Math.floor(
    Math.random() * 10000000,
  )}-${new Date().getTime()}${path.extname(file.originalname)}`;
}
