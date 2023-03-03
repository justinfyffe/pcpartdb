import { Injectable } from '@nestjs/common';
import {
  importFromTechPowerUp,
  importFromUlBenchmarks,
  importFromVideocardBenchmarks,
} from '@pcpartdb/scraper';
import {
  GpuDataSource,
  ImportGpuDataRequest,
  ImportGpuDataResponse,
} from '@pcpartdb/shared/gpus';
import { badRequestError } from '../shared/error';
import { deepMergeObjects } from '../shared/utils';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
  UlBenchmarks = 'benchmarks.ul.com',
  VideocardBenchmark = 'www.videocardbenchmark.net',
}

@Injectable()
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
