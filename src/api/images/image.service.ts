import { Injectable } from '@nestjs/common';
import { ValidationErrorType } from '../../types/error';
import {
  createImageValidator,
  ImageFormData,
  updateImageValidator,
} from '../../types/image';
import * as cdn from '../shared/cdn/cdn.utils';
import { badRequestError, notFoundError } from '../shared/errors/errors';
import { ServiceContext } from '../shared/service/context';
import { validate } from '../shared/types/validate';
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

    await cdn.moveObject(`tmp/${data.tempPath}`, `images/${data.path}`);

    return await this.imageRepository.save(data, ctx);
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
      if (await cdn.hasObject(`images/${data.path}`)) {
        // A different image exists at this path. Abort
        throw badRequestError({
          property: 'path',
          constraint: ValidationErrorType.FileExists,
        });
      }

      // All good to move
      if (await cdn.hasObject(`images/${previousPath}`)) {
        await cdn.moveObject(`images/${previousPath}`, `images/${data.path}`);
      }
    }

    // Check if we uploaded a new image, move it if we did
    if (data.file) {
      await cdn.moveObject(`tmp/${data.tempPath}`, `images/${data.path}`);
    }

    image.uploadedAt = (
      await cdn.getObject(`images/${data.path}`)
    ).LastModified;

    return await this.imageRepository.save(image, ctx);
  }

  async delete(id: number, ctx: ServiceContext) {
    const image = await this.imageRepository.findById(id, ctx);
    if (image == null) {
      throw notFoundError({ user: id });
    }

    await this.imageRepository.delete(id, ctx);
    await cdn.deleteObject(`images/${image.path}`);
    return id;
  }
}
