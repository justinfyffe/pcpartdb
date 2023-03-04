import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import {
  CreateImageRequest,
  UpdateImageRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import { validate } from '../shared/types/validate';
import * as fileUtils from '../shared/utils';
import { mapToImageDto, mapToImageEntity } from './image.mapper';
import { ImageRepository } from './image.repository';

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

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  async list(ctx: Context) {
    const rows = await this.imageRepository.list(ctx);
    return rows.map((row) => mapToImageDto(row));
  }

  async get(id: number, ctx: Context) {
    const row = await this.imageRepository.findById(id, ctx);
    if (row == null) {
      throw notFoundError({ image: id });
    }

    return mapToImageDto(row);
  }

  async create(data: CreateImageRequest, ctx: Context) {
    validate(data, imageValidator);

    // Check if another image already exists at the path
    const existingImage = await this.imageRepository.findByPath(data.path);
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

    const entity = mapToImageEntity({
      ...data,
      uploadedAt: stats.mtime.getTime(),
    });
    const row = await this.imageRepository.create(entity, ctx);

    return mapToImageDto(row);
  }

  async update(id: number, data: UpdateImageRequest, ctx: Context) {
    validate(data, imageValidator);

    const image = await this.imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ image: id });
    }

    // Check if another image already exists at the path
    const existingImage = await this.imageRepository.findByPath(data.path);
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

    const entity = mapToImageEntity({
      ...data,
      uploadedAt: stats.mtime.getTime(),
    });
    const row = await this.imageRepository.update(id, entity, ctx);

    return mapToImageDto(row);
  }

  async delete(id: number, ctx: Context) {
    const image = await this.imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    await this.imageRepository.delete(id, ctx);
    await fileUtils.remove(fileUtils.imagePath(image.path));
    return id;
  }
}
