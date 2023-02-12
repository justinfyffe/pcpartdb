import { importFromTechPowerUp } from '@scrapers/techpowerup';
import { importFromUlBenchmarks } from '@scrapers/ul-benchmarks';
import { importFromVideoCardBenchmark } from '@scrapers/videocardbenchmark';
import { badRequestError } from '@server/shared/api/status';
import { ImportGpuDataRequest } from '@shared/gpus';

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
