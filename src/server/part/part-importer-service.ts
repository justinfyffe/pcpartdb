import { badRequestError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import * as fileUtils from '@server/shared/utils/file-utils';
import {
  ExportPartsRequest,
  ExportPartsResponse,
  ImportPartialPartRequest,
} from '@shared/part';
import fs from 'fs/promises';
import { importFromJsonFile } from './importers/json-file-importer';
import { importFromTechPowerUp } from './importers/techpowerup-importer';
import { partService } from './part-service';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
}

export class PartImporterService {
  async importPartialPart(request: ImportPartialPartRequest) {
    const parsedUrl = new URL(request.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await importFromTechPowerUp(request.url);
    } else {
      throw badRequestError();
    }
  }

  async importParts(file: string, ctx: Context) {
    return await importFromJsonFile(file, ctx);
  }

  async exportParts(request: ExportPartsRequest, ctx: Context) {
    const { ids } = request;

    // Gather data
    let part = await partService.export(ids[0], ctx);
    part = { ...part, id: undefined, images: {} };

    // Create files to export
    const recommendedFileName = `${part.slug}.json`;
    const tempFileName = fileUtils.generateRandomName(part.slug, 'json');
    const tempFilePath = fileUtils.exportsPath(tempFileName);
    await fs.writeFile(tempFilePath, JSON.stringify([part]), 'utf-8');

    // Return exported file
    return { file: tempFileName, recommendedFileName } as ExportPartsResponse;
  }
}

export const partImporterService = new PartImporterService();
