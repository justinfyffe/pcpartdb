import { badRequestError } from '@server/shared/api/status';
import { ImportPartRequest } from '@shared/part';
import { importFromTechPowerUp } from './importers/techpowerup-importer';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
}

export class PartImporterService {
  async import(request: ImportPartRequest) {
    const parsedUrl = new URL(request.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return importFromTechPowerUp(request.url);
    } else {
      throw badRequestError();
    }
  }
}

export const partImporterService = new PartImporterService();
