import { ImportProductRequest } from '@shared/product';
import { importFromTechPowerUp } from './importers/techpowerup-importer';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
}

export class ProductImporterService {
  async import(request: ImportProductRequest) {
    const parsedUrl = new URL(request.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      importFromTechPowerUp(request.url);
    }
  }
}

export const productImporterService = new ProductImporterService();
