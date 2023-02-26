import { importFromTechPowerUp } from '@scrapers/techpowerup';
import { importFromUlBenchmarks } from '@scrapers/ul-benchmarks';
import { importFromVideoCardBenchmark } from '@scrapers/videocardbenchmark';
import { badRequestError } from '@server/shared/api/status';
import { deepMergeObjects } from '@server/shared/utils/object-utils';
import {
  GpuDataSource,
  ImportGpuDataRequest,
  ImportGpuDataResponse,
} from '@shared/gpus';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
  UlBenchmarks = 'benchmarks.ul.com',
  VideoCardBenchmark = 'www.videocardbenchmark.net',
}

export class GpuImporterService {
  async importData(request: ImportGpuDataRequest) {
    const result: ImportGpuDataResponse = { gpu: {} };

    for (let i = 0; i < request.sources.length; ++i) {
      deepMergeObjects(
        result,
        await this.importDataFromSource(request.sources[i]),
      );
    }

    return result;
  }

  private async importDataFromSource(source: GpuDataSource) {
    const parsedUrl = new URL(source.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await importFromTechPowerUp(source.url);
    } else if (parsedUrl.hostname === Importers.UlBenchmarks) {
      return await importFromUlBenchmarks(source.url);
    } else if (parsedUrl.hostname === Importers.VideoCardBenchmark) {
      return await importFromVideoCardBenchmark(source.url);
    } else {
      throw badRequestError();
    }
  }
}

export const gpuImporterService = new GpuImporterService();
