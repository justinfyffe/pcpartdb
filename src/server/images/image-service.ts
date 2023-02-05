import Joi from '@hapi/joi';
import { badRequestError, notFoundError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { validate } from '@server/shared/types/validate';
import * as fileUtils from '@server/shared/utils/file-utils';
import { ValidationErrorType } from '@shared/error';
import { ImageRequest } from '@shared/image';
import { mapToImageDto } from './image-mappers';
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
    const rows = await imageRepository.list(ctx);
    return rows.map((row) => mapToImageDto(row));
  }

  async get(id: number, ctx: Context) {
    const row = await imageRepository.findById(id, ctx);
    if (row == null) {
      throw notFoundError({ image: id });
    }

    return mapToImageDto(row);
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

    const stats = await fileUtils.stats(fileUtils.imagePath(data.path));

    const row = await imageRepository.create(
      {
        name: data.name,
        path: data.path,
        sourceName: data.sourceName,
        sourceUrl: data.sourceUrl,
        fileSize: data.fileSize,
        height: data.height,
        width: data.width,
        uploadedAt: stats.mtime,
      },
      ctx,
    );

    return mapToImageDto(row);
  }

  async update(id: number, data: ImageRequest, ctx: Context) {
    validate(data, imageValidator);

    const image = await imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ image: id });
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

    const row = await imageRepository.update(
      id,
      {
        name: data.name,
        path: data.path,
        sourceName: data.sourceName,
        sourceUrl: data.sourceUrl,
        fileSize: data.fileSize,
        height: data.height,
        width: data.width,
        uploadedAt: stats.mtime,
      },
      ctx,
    );

    return mapToImageDto(row);
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
