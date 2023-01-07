import Joi from '@hapi/joi';
import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import { validate } from '@server/shared/types/validate';
import * as uploadUtils from '@server/shared/uploads/file-utils';
import { throttlePromises } from '@server/shared/utils/promise-utils';
import { ValidationErrorType } from '@shared/error';
import { Image, ImageRequest } from '@shared/image';
import { imageRepository } from './image-repository';

const imageValidator = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  fileSize: Joi.number(),
  height: Joi.number(),
  width: Joi.number(),
  sourceName: Joi.string().allow('', null),
  sourceUrl: Joi.string().allow('', null),
  file: Joi.any().required(),
  tempPath: Joi.string().allow('', null),
}).options({ abortEarly: false });

export class ImageService {
  async list(ctx: Context) {
    return await imageRepository.list(ctx);
  }

  async get(id: number, ctx: Context) {
    const image = await imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    return image;
  }

  // TODO: prevent overriding images
  async create(data: ImageRequest, ctx: Context) {
    validate(data, imageValidator);

    await uploadUtils.move(
      uploadUtils.uploadsPath(data.tempPath),
      uploadUtils.imagePath(data.path),
    );

    return await imageRepository.save(
      {
        name: data.name,
        path: data.path,
        sourceName: data.sourceName,
        sourceUrl: data.sourceUrl,
        fileSize: data.fileSize,
        height: data.height,
        width: data.width,
      },
      ctx,
    );
  }

  // TODO: prevent overriding images
  async update(id: number, data: ImageRequest, ctx: Context) {
    validate(data, imageValidator);

    const image = await imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    const previousPath = image.path;

    // Check if the path has changed. If it did, we should move the image
    if (previousPath !== data.path) {
      if (await uploadUtils.exists(uploadUtils.imagePath(data.path))) {
        // A different image exists at this path. Abort
        throw badRequestError({
          property: 'path',
          constraint: ValidationErrorType.FileExists,
        });
      }

      // All good to move
      if (await uploadUtils.exists(uploadUtils.imagePath(previousPath))) {
        await uploadUtils.move(
          uploadUtils.imagePath(previousPath),
          uploadUtils.imagePath(data.path),
        );
      }
    }

    // Check if we uploaded a new image, move it if we did
    if (data.file) {
      await uploadUtils.move(
        uploadUtils.uploadsPath(data.tempPath),
        uploadUtils.imagePath(data.path),
      );
    }

    const stats = await uploadUtils.stats(uploadUtils.imagePath(data.path));

    // Update image data
    image.name = data.name ?? image.name;
    image.path = data.path ?? image.path;
    image.sourceName = data.sourceName ?? image.sourceName;
    image.sourceUrl = data.sourceUrl ?? image.sourceUrl;
    image.fileSize = data.fileSize ?? image.fileSize;
    image.height = data.height ?? image.height;
    image.width = data.width ?? image.width;
    image.uploadedAt = stats.mtime;

    return await imageRepository.save(image, ctx);
  }

  async delete(id: number, ctx: Context) {
    const image = await imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    await imageRepository.delete(id, ctx);
    await uploadUtils.remove(uploadUtils.imagePath(image.path));
    return id;
  }

  async import(images: Image[], ctx: Context) {
    const promises = images.map((image) =>
      imageRepository.save(
        { ...image, uploadedAt: new Date(image.uploadedAt) },
        ctx,
      ),
    );
    await throttlePromises(promises, 5);
  }

  async export(ids: number[], ctx: Context) {
    const images = await imageRepository.findByIds(ids, ctx);
    return serialize(images) as Image[];
  }
}

export const imageService = new ImageService();
