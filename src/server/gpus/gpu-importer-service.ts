import { badRequestError } from '@server/shared/api/status';
import { ImportGpuDataRequest } from '@shared/gpus';
import { importFromTechPowerUp } from './importers/techpowerup-importer';
import { importFromUlBenchmarks } from './importers/ul-benchmarks-importer';
import { importFromVideoCardBenchmark } from './importers/videocardbenchmark-importer';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
  UlBenchmarks = 'benchmarks.ul.com',
  VideoCardBenchmark = 'www.videocardbenchmark.net',
}

export class GpuImporterService {
  async importData(request: ImportGpuDataRequest) {
    const parsedUrl = new URL(request.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await importFromTechPowerUp(request.url);
    } else if (parsedUrl.hostname === Importers.UlBenchmarks) {
      return await importFromUlBenchmarks(request.url);
    } else if (parsedUrl.hostname === Importers.VideoCardBenchmark) {
      return await importFromVideoCardBenchmark(request.url);
    } else {
      throw badRequestError();
    }
  }
}

export const gpuImporterService = new GpuImporterService();
