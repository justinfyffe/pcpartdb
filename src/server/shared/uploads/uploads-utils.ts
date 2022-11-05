import * as fs from 'fs';
import multer, { diskStorage } from 'multer';
import path from 'path';
import { Context } from '../context';

const TMP_PATH = path.join(__dirname, '../../../..', 'tmp/uploads');
const IMAGES_PATH = path.join(__dirname, '../../../..', 'public/u/images');

if (!fs.existsSync(TMP_PATH)) {
  fs.mkdirSync(TMP_PATH, { recursive: true });
}
if (!fs.existsSync(IMAGES_PATH)) {
  fs.mkdirSync(IMAGES_PATH, { recursive: true });
}

const multerOptions: multer.Options = {
  storage: diskStorage({
    destination: tmpPath(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: (req: any, file: any, cb: any) => {
      const tempPath = generateTmpFilename(file);
      req.body.tempPath = tempPath;
      cb(null, tempPath);
    },
  }),
};
const uploader = multer(multerOptions);

export function uploadFile(field: string, ctx: Context) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploader.single(field)(ctx.req as any, ctx.res as any, async (err) => {
      if (err) {
        reject();
        return;
      }

      resolve(null);
    });
  });
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
