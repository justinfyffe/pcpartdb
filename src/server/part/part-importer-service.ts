import { badRequestError } from '@server/shared/api/status';
import { ImportPartDataRequest } from '@shared/part';
import { importFromTechPowerUp } from './importers/techpowerup-importer';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
}

export class PartImporterService {
  async importPartData(request: ImportPartDataRequest) {
    const parsedUrl = new URL(request.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await importFromTechPowerUp(request.url);
    } else {
      throw badRequestError();
    }
  }
}

export const partImporterService = new PartImporterService();
