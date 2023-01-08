import { ApiContext } from '@server/shared/api/context';
import { staffController } from '@server/shared/api/controller';
import * as fileUtils from '@server/shared/utils/file-utils';
import type { ImageRequest } from '@shared/image';
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

export const listImages = staffController(async (ctx: ApiContext) => {
  return await imageService.list(ctx);
});

export const createImage = staffController(async (ctx: ApiContext) => {
  await fileUtils.uploadFile('file', ctx);

  const body = ctx.req.body as CreateImageBody;
  const data = JSON.parse(body.formData) as ImageRequest;
  const tempPath = body.tempPath;

  return await imageService.create({ ...data, tempPath }, ctx);
});

export const updateImage = staffController(async (ctx: ApiContext) => {
  await fileUtils.uploadFile('file', ctx);

  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as UpdateImageBody;
  const data = JSON.parse(body.formData) as ImageRequest;
  const tempPath = body.tempPath;

  return await imageService.update(id, { ...data, tempPath }, ctx);
});

export const deleteImage = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await imageService.delete(id, ctx);
});
