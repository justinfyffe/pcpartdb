import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { mapToImageDto, mapToImageEntity } from '@pcpartdb/database';
import {
  CreateImageRequest,
  Image,
  ListImagesRequest,
  listImagesRequestSchema,
  ListImagesResponse,
  UpdateImageRequest,
  ValidationErrorType,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { badRequestError, notFoundError } from '../shared/error';
import * as fileUtils from '../shared/utils';
import { validate } from '../shared/validation/validate';
import { ImageRepository } from './image.repository';
import { ImageManipulationService } from './image-manipulation.service';
import { ImageStatService } from './image-stat.service';

const imageValidator = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  sourceName: Joi.string().allow('', null),
  sourceUrl: Joi.string().allow('', null),
  manipulation: Joi.string().allow('', null),
  file: Joi.any().required(),
  tempPath: Joi.string().allow('', null),
}).options({ abortEarly: false });

interface ListOptions {
  skipCount?: boolean;
}

@Injectable()
export class ImageService {
  constructor(
    private imageRepository: ImageRepository,
    private imageStatService: ImageStatService,
    private imageManipulationService: ImageManipulationService,
  ) {}

  async count(request: ListImagesRequest, ctx: Context) {
    validate(request, listImagesRequestSchema);

    const { query } = request;
    const count = await this.imageRepository.count({ ...query }, ctx);

    return count;
  }

  async list(request: ListImagesRequest, options: ListOptions, ctx: Context) {
    validate(request, listImagesRequestSchema);

    const skipCount = options.skipCount ?? false;
    const { query } = request;

    const entities = await this.imageRepository.list({ ...query }, ctx);
    let count: number;
    if (!skipCount) {
      count = await this.count(request, ctx);
    }

    const images: Image[] = entities.map((entity) => mapToImageDto(entity));

    const response: ListImagesResponse = {
      query,
      results: images,
      total: count,
    };

    return response;
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

    if (data.manipulation) {
      // Manipulation preset is set, therefore manipulate the image
      // and delete the original.
      await this.imageManipulationService.manipulate({
        preset: data.manipulation,
        imagePath: fileUtils.uploadsPath(data.tempPath),
        outputPath: fileUtils.uploadedImagesPath(data.path),
      });
      await fileUtils.remove(fileUtils.uploadsPath(data.tempPath));
    } else {
      // Manipulation preset is not set, therefore just move the image.
      await fileUtils.move(
        fileUtils.uploadsPath(data.tempPath),
        fileUtils.uploadedImagesPath(data.path),
      );
    }

    const imageStats = await this.imageStatService.stat(
      fileUtils.uploadedImagesPath(data.path),
    );
    const fileStats = await fileUtils.stats(
      fileUtils.uploadedImagesPath(data.path),
    );

    const entity = mapToImageEntity({
      ...data,
      fileSize: imageStats.fileSize,
      width: imageStats.width,
      height: imageStats.height,
      uploadedAt: fileStats.mtime.getTime(),
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
      if (await fileUtils.exists(fileUtils.uploadedImagesPath(data.path))) {
        // A different image exists at this path. Abort
        throw badRequestError({
          property: 'path',
          constraint: ValidationErrorType.FileExists,
        });
      }

      // All good to move
      if (await fileUtils.exists(fileUtils.uploadedImagesPath(previousPath))) {
        await fileUtils.move(
          fileUtils.uploadedImagesPath(previousPath),
          fileUtils.uploadedImagesPath(data.path),
        );
      }
    }

    // Check if we uploaded a new image, move it if we did
    if (data.file) {
      // Manipulation preset is set, therefore manipulate the image
      // and delete the original.
      await this.imageManipulationService.manipulate({
        preset: data.manipulation,
        imagePath: fileUtils.uploadsPath(data.tempPath),
        outputPath: fileUtils.uploadedImagesPath(data.path),
      });
      await fileUtils.remove(fileUtils.uploadsPath(data.tempPath));
    } else {
      // Manipulation preset is not set, therefore just move the image.
      await fileUtils.move(
        fileUtils.uploadsPath(data.tempPath),
        fileUtils.uploadedImagesPath(data.path),
      );
    }

    const imageStats = await this.imageStatService.stat(
      fileUtils.uploadedImagesPath(data.path),
    );
    const fileStats = await fileUtils.stats(
      fileUtils.uploadedImagesPath(data.path),
    );

    const entity = mapToImageEntity({
      ...data,
      fileSize: imageStats.fileSize,
      width: imageStats.width,
      height: imageStats.height,
      uploadedAt: fileStats.mtime.getTime(),
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
    await fileUtils.remove(fileUtils.uploadedImagesPath(image.path));
    return id;
  }
}
