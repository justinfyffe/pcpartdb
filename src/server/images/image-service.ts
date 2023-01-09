import Joi from '@hapi/joi';
import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { validate } from '@server/shared/types/validate';
import * as fileUtils from '@server/shared/utils/file-utils';
import { ValidationErrorType } from '@shared/error';
import { ImageRequest } from '@shared/image';
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

  async create(data: ImageRequest, ctx: Context) {
    validate(data, imageValidator);

    // Check if another image already exists at the path
    const existingImage = await imageRepository.findByPath(data.path);
    if (existingImage != null) {
      throw badRequestError({
        property: 'path',
        constraint: 'EXISTING_IMAGE_AT_PATH',
      });
    }

    await fileUtils.move(
      fileUtils.uploadsPath(data.tempPath),
      fileUtils.imagePath(data.path),
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

  async update(id: number, data: ImageRequest, ctx: Context) {
    validate(data, imageValidator);

    const image = await imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    // Check if another image already exists at the path
    const existingImage = await imageRepository.findByPath(data.path);
    if (existingImage != null && existingImage.id !== id) {
      throw badRequestError({
        property: 'path',
        constraint: 'EXISTING_IMAGE_AT_PATH',
      });
    }

    const previousPath = image.path;

    // Check if the path has changed. If it did, we should move the image
    if (previousPath !== data.path) {
      if (await fileUtils.exists(fileUtils.imagePath(data.path))) {
        // A different image exists at this path. Abort
        throw badRequestError({
          property: 'path',
          constraint: ValidationErrorType.FileExists,
        });
      }

      // All good to move
      if (await fileUtils.exists(fileUtils.imagePath(previousPath))) {
        await fileUtils.move(
          fileUtils.imagePath(previousPath),
          fileUtils.imagePath(data.path),
        );
      }
    }

    // Check if we uploaded a new image, move it if we did
    if (data.file) {
      await fileUtils.move(
        fileUtils.uploadsPath(data.tempPath),
        fileUtils.imagePath(data.path),
      );
    }

    const stats = await fileUtils.stats(fileUtils.imagePath(data.path));

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
    await fileUtils.remove(fileUtils.imagePath(image.path));
    return id;
  }
}

export const imageService = new ImageService();
