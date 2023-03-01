import { importFromTechPowerUp } from '@pcpartdb/website/scrapers/techpowerup';
import { importFromUlBenchmarks } from '@pcpartdb/website/scrapers/ul-benchmarks';
import { importFromVideocardBenchmarks } from '@pcpartdb/website/scrapers/videocardbenchmarks';
import { badRequestError } from '@pcpartdb/website/server/shared/api/status';
import { deepMergeObjects } from '@pcpartdb/website/server/shared/utils/object-utils';
import {
  GpuDataSource,
  ImportGpuDataRequest,
  ImportGpuDataResponse,
} from '@pcpartdb/website/shared/gpus';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
  UlBenchmarks = 'benchmarks.ul.com',
  VideocardBenchmark = 'www.videocardbenchmark.net',
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
    } else if (parsedUrl.hostname === Importers.VideocardBenchmark) {
      return await importFromVideocardBenchmarks(source.url);
    } else {
      throw badRequestError();
    }
  }
}

export const gpuImporterService = new GpuImporterService();
