import { Injectable } from '@nestjs/common';
import { ValidationErrorType } from '../../types/error';
import {
  createImageValidator,
  ImageFormData,
  updateImageValidator,
} from '../../types/image';
import { badRequestError, notFoundError } from '../shared/errors/errors';
import { ServiceContext } from '../shared/service/context';
import { validate } from '../shared/types/validate';
import * as uploads from '../shared/uploads/uploads.utils';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(private imageRepository: ImageRepository) {}

  async list(ctx: ServiceContext) {
    return await this.imageRepository.list(ctx);
  }

  async get(id: number, ctx: ServiceContext) {
    const image = await this.imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    return image;
  }

  async create(data: ImageFormData, ctx: ServiceContext) {
    validate(data, createImageValidator);

    await uploads.move(
      uploads.tmpPath(data.tempPath),
      uploads.imagePath(data.path),
    );

    return await this.imageRepository.save(
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

  async update(id: number, data: ImageFormData, ctx: ServiceContext) {
    validate(data, updateImageValidator);

    const image = await this.imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    const previousPath = image.path;

    // Check if the path has changed. If it did, we should move the image
    if (previousPath !== data.path) {
      if (await uploads.exists(uploads.imagePath(data.path))) {
        // A different image exists at this path. Abort
        throw badRequestError({
          property: 'path',
          constraint: ValidationErrorType.FileExists,
        });
      }

      // All good to move
      if (await uploads.exists(uploads.imagePath(previousPath))) {
        await uploads.move(
          uploads.imagePath(previousPath),
          uploads.imagePath(data.path),
        );
      }
    }

    // Check if we uploaded a new image, move it if we did
    if (data.file) {
      await uploads.move(
        uploads.tmpPath(data.tempPath),
        uploads.imagePath(data.path),
      );
    }

    const stats = await uploads.stats(uploads.imagePath(data.path));

    // Update image data
    image.name = data.name ?? image.name;
    image.path = data.path ?? image.path;
    image.sourceName = data.sourceName ?? image.sourceName;
    image.sourceUrl = data.sourceUrl ?? image.sourceUrl;
    image.fileSize = data.fileSize ?? image.fileSize;
    image.height = data.height ?? image.height;
    image.width = data.width ?? image.width;
    image.uploadedAt = stats.mtime;

    return await this.imageRepository.save(image, ctx);
  }

  async delete(id: number, ctx: ServiceContext) {
    const image = await this.imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    await this.imageRepository.delete(id, ctx);
    await uploads.remove(uploads.imagePath(image.path));
    return id;
  }
}
