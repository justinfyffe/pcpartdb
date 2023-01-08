import { badRequestError } from '@server/shared/api/status';
import { Context } from '@server/shared/context';
import { serialize } from '@server/shared/types/serialize';
import * as fileUtils from '@server/shared/utils/file-utils';
import {
  ExportPartsRequest,
  ExportPartsResponse,
  ImportPartialPartRequest,
  Part,
} from '@shared/part';
import fs from 'fs/promises';
import { importFromJsonFile } from './importers/json-file-importer';
import { importFromTechPowerUp } from './importers/techpowerup-importer';
import { partRepository } from './part-repository';

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
    const partModels = await partRepository.findByIds({ ids }, ctx);
    const parts: Part[] = serialize(partModels);
    parts.forEach((part) => {
      part.id = undefined;
      part.images = {};
    });

    // Create files to export
    const recommendedFileName =
      parts.length === 1 ? `${parts[0].slug}.json` : 'parts.json';
    const tempFileName = fileUtils.generateRandomName(null, 'json');
    const tempFilePath = fileUtils.exportsPath(tempFileName);
    await fs.writeFile(tempFilePath, JSON.stringify(parts), 'utf-8');

    // Return exported file
    return { file: tempFileName, recommendedFileName } as ExportPartsResponse;
  }
}

export const partImporterService = new PartImporterService();
