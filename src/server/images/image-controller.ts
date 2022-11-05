import { ApiContext } from '@server/shared/api/context';
import { staffController } from '@server/shared/api/controller';
import * as uploads from '@server/shared/uploads/uploads-utils';
import type { ImageRequest } from '@shared/image';
import multer, { diskStorage } from 'multer';
import { imageService } from './image-service';

interface CreateImageBody {
  file: File;
  formData: string;
  tempPath?: string;
}

interface UpdateImageBody {
  file?: File;
  formData: string;
  tempPath?: string;
}

const multerOptions: multer.Options = {
  storage: diskStorage({
    destination: uploads.tmpPath(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: (req: any, file: any, cb: any) => {
      const tempPath = uploads.generateTmpFilename(file);
      req.body.tempPath = tempPath;
      cb(null, tempPath);
    },
  }),
};
const uploader = multer(multerOptions);

export const listImages = staffController(async (ctx: ApiContext) => {
  return await imageService.list(ctx);
});

export const getImage = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await imageService.get(id, ctx);
});

export const createImage = staffController(async (ctx: ApiContext) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploader.single('file')(ctx.req as any, ctx.res as any, async (err) => {
      if (err) {
        reject();
        return;
      }

      const body = ctx.req.body as CreateImageBody;
      const data = JSON.parse(body.formData) as ImageRequest;
      const tempPath = body.tempPath;

      resolve(await imageService.create({ ...data, tempPath }, ctx));
    });
  });
});

export const updateImage = staffController(async (ctx: ApiContext) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploader.single('file')(ctx.req as any, ctx.res as any, async (err) => {
      if (err) {
        reject();
        return;
      }

      const id = Number(ctx.req.query['id'] as string);
      const body = ctx.req.body as UpdateImageBody;
      const data = JSON.parse(body.formData) as ImageRequest;
      const tempPath = body.tempPath;

      resolve(await imageService.update(id, { ...data, tempPath }, ctx));
    });
  });
});

export const deleteImage = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await imageService.delete(id, ctx);
});
