import { imageService } from '@server/images/image-service';
import { partService } from '@server/part/part-service';
import { Context } from '@server/shared/context';
import * as uploads from '@server/shared/uploads/file-utils';
import { Image } from '@shared/image';
import { Part } from '@shared/part';
import fs from 'fs/promises';
import path from 'path';
import * as tar from 'tar';

const CONTENT_JSON_PATH = uploads.uploadsPath('pc-part-db-content.json');
const IMPORT_FOLDER_PATH = uploads.uploadsPath('pc-part-db-export');
const EXPORT_FILE_PATH = uploads.uploadsPath('pc-part-db-export.tgz');

interface ExportContentData {
  parts: Part[];
  images: Image[];
}

export class ExportService {
  async exportContent(ctx: Context) {
    const parts = await partService.export(ctx);
    const images = await imageService.export(ctx);

    const data = { parts, images } as ExportContentData;

    await fs.writeFile(CONTENT_JSON_PATH, JSON.stringify(data), 'utf-8');

    await tar.create({ gzip: true, file: EXPORT_FILE_PATH }, [
      CONTENT_JSON_PATH,
      uploads.imagePath(),
    ]);

    return EXPORT_FILE_PATH;
  }

  async importContent(file: string, ctx: Context) {
    await tar.extract({
      file,
      C: IMPORT_FOLDER_PATH,
    });

    // TODO: move images

    // Import Content Data
    const data: ExportContentData = JSON.parse(
      await fs.readFile(
        path.join(IMPORT_FOLDER_PATH, CONTENT_JSON_PATH),
        'utf-8',
      ),
    );
    const { parts, images } = data;

    await partService.import(parts, ctx);
    await imageService.import(images, ctx);
  }
}

export const exportService = new ExportService();
