import { Injectable } from '@nestjs/common';
import {
  scrapeTechPowerUpGpuDetails,
  scrapeUlBenchmarksGpuDetails,
  scrapeVideocardBenchmarksGpuDetails,
} from '@pcpartdb/scraper';
import {
  Gpu,
  GpuDataSource,
  ImportGpuDataRequest,
  ImportGpuDataResponse,
  PreviewImportGpusResponse,
} from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { Context } from '../shared/context';
import { badRequestError } from '../shared/error';
import { deepMergeObjects } from '../shared/utils';
import * as fileUtils from '../shared/utils';
import { mapToGpuDto } from './gpu.mapper';
import { GpuRepository } from './gpu.repository';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
  UlBenchmarks = 'benchmarks.ul.com',
  VideocardBenchmark = 'www.videocardbenchmark.net',
}

@Injectable()
export class GpuImporterService {
  constructor(private gpuRepository: GpuRepository) {}

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

  async previewImport(importFilename: string, ctx: Context) {
    const path = fileUtils.uploadsPath(importFilename);
    const json = await fsPromises.readFile(path, 'utf-8');
    const gpusToImport: Gpu[] = JSON.parse(json);
    await fileUtils.remove(path);

    const newGpus: Gpu[] = [];
    const existingGpus: Gpu[] = [];

    for (let i = 0; i < gpusToImport.length; ++i) {
      const gpuToImport = gpusToImport[i];
      const name = gpuToImport.name;
      const slug = gpuToImport.slug;

      let gpuEntity = await this.gpuRepository.findBySlug(slug, {}, ctx);
      gpuEntity = gpuEntity || (await this.gpuRepository.findByName(name, ctx));

      if (gpuEntity == null) {
        newGpus.push(gpuToImport);
      } else {
        const existingGpu = mapToGpuDto(gpuEntity, { includeSources: true });
        existingGpus.push(existingGpu);
      }
    }

    return { newGpus, existingGpus } as PreviewImportGpusResponse;
  }

  private async importDataFromSource(source: GpuDataSource) {
    const parsedUrl = new URL(source.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await scrapeTechPowerUpGpuDetails(source.url);
    } else if (parsedUrl.hostname === Importers.UlBenchmarks) {
      return await scrapeUlBenchmarksGpuDetails(source.url);
    } else if (parsedUrl.hostname === Importers.VideocardBenchmark) {
      return await scrapeVideocardBenchmarksGpuDetails(source.url);
    } else {
      throw badRequestError();
    }
  }
}
