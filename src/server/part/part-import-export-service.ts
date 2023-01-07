import { imageRepository } from '@server/images/image-repository';
import { imageService } from '@server/images/image-service';
import { partService } from '@server/part/part-service';
import { Context } from '@server/shared/context';
import * as fileUtils from '@server/shared/uploads/file-utils';
import { Image } from '@shared/image';
import { ExportPartRequest, ExportPartResult, Part } from '@shared/part';
import fs from 'fs/promises';
import path from 'path';
import * as tar from 'tar';
import { partRepository } from './part-repository';

const PARTS_JSON_FILENAME = 'parts.json';
const IMAGES_JSON_FILENAME = 'images.json';
const IMAGES_FOLDER_NAME = 'images';

export class PartImportExportService {
  async import(file: string, ctx: Context) {
    // Get correct file names, create folder
    const tempFolderName = path.parse(file).name;
    const filePath = fileUtils.uploadsPath(file);
    const tempFolderPath = fileUtils.uploadsPath(tempFolderName);
    await fileUtils.createFolder(tempFolderPath);

    // Extract files
    await tar.extract({
      file: filePath,
      cwd: tempFolderPath,
    });

    const imagesFolderPath = path.join(tempFolderPath, IMAGES_FOLDER_NAME);
    const imagesJsonPath = path.join(tempFolderPath, IMAGES_JSON_FILENAME);
    const partsJsonPath = path.join(tempFolderPath, PARTS_JSON_FILENAME);

    // Import
    const images = JSON.parse(await fs.readFile(imagesJsonPath, 'utf-8'));
    const parts = JSON.parse(await fs.readFile(partsJsonPath, 'utf-8'));
    await this.processImport(parts, images, imagesFolderPath, ctx);

    // Cleanup
    await fileUtils.remove(filePath);
    await fileUtils.removeFolder(tempFolderPath);
  }

  async export(request: ExportPartRequest, ctx: Context) {
    const { id: partId } = request;

    // Gather data
    const part = await partService.export(partId, ctx);
    const imageIds = part.images?.details?.map((image) => image.imageId) ?? [];
    const images = await imageService.export(imageIds, ctx);

    // Create files to export
    const recommendedFileName = `${part.slug}.tgz`;
    const tempFolderName = fileUtils.generateRandomName(part.slug);
    const tempFolderPath = fileUtils.exportsPath(tempFolderName);
    const tgzFileName = `${tempFolderName}.tgz`;
    const tgzFilePath = fileUtils.exportsPath(tgzFileName);
    const imagesFolderPath = path.join(tempFolderPath, IMAGES_FOLDER_NAME);
    const partsJsonPath = path.join(tempFolderPath, PARTS_JSON_FILENAME);
    const imagesJsonPath = path.join(tempFolderPath, IMAGES_JSON_FILENAME);

    await fileUtils.createFolder(tempFolderPath);
    await fileUtils.createFolder(imagesFolderPath);
    await fs.writeFile(partsJsonPath, JSON.stringify([part]), 'utf-8');
    await fs.writeFile(imagesJsonPath, JSON.stringify(images), 'utf-8');
    for (const image of images) {
      await fileUtils.copy(
        fileUtils.imagePath(image.path),
        path.join(imagesFolderPath, image.path),
      );
    }

    // Create gzip
    await tar.create(
      {
        gzip: true,
        portable: true,
        cwd: tempFolderPath,
        file: tgzFilePath,
      },
      [IMAGES_FOLDER_NAME, PARTS_JSON_FILENAME, IMAGES_JSON_FILENAME],
    );

    // Cleanup
    await fileUtils.removeFolder(tempFolderPath);

    return { file: tgzFileName, recommendedFileName } as ExportPartResult;
  }

  async deleteArchive(file: string) {
    const path = fileUtils.exportsPath(file);
    await fileUtils.remove(path);
  }

  private async processImport(
    parts: Part[],
    images: Image[],
    importImagesFolder: string,
    ctx: Context,
  ) {
    const imageIdsMap: Record<number, number> = {};
    for (const image of images) {
      await fileUtils.copy(
        path.join(importImagesFolder, image.path),
        fileUtils.imagePath(image.path),
      );

      const foundImage = await imageRepository.findByPath(image.path, ctx);

      if (foundImage != null) {
        imageIdsMap[image.id] = foundImage.id;
        await imageRepository.save({
          ...image,
          id: foundImage.id,
          uploadedAt: new Date(image.uploadedAt),
        });
      } else {
        const newImage = await imageRepository.save(
          { ...image, id: undefined, uploadedAt: new Date(image.uploadedAt) },
          ctx,
        );
        imageIdsMap[image.id] = newImage.id;
      }
    }

    for (const part of parts) {
      const foundPart = await partRepository.find({ slug: part.slug }, ctx);

      // Fix image ids
      part.images?.details?.forEach((image) => {
        image.imageId = imageIdsMap[image.imageId];
      });

      if (foundPart) {
        await partRepository.save({
          ...part,
          id: foundPart.id,
        });
      } else {
        partRepository.save({
          ...part,
          id: undefined,
        });
      }
    }
  }
}

export const partImportExportService = new PartImportExportService();
