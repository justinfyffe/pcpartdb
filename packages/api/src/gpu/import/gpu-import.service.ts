import { Injectable } from '@nestjs/common';
import {
  scrapeTechPowerUpGpuDetails,
  scrapeUlBenchmarksGpuDetails,
  scrapeVideocardBenchmarksGpuDetails,
} from '@pcpartdb/scraper';
import {
  Gpu,
  GpuDataSource,
  ImportGpusRequest,
  PreviewImportGpusResponse,
  ScrapeGpuDetailsRequest,
  ScrapeGpuDetailsResponse,
} from '@pcpartdb/shared';
import e from 'express';
import * as fsPromises from 'fs/promises';
import { Context } from '../../shared/context';
import { badRequestError } from '../../shared/error';
import { deepMergeObjects } from '../../shared/utils';
import * as fileUtils from '../../shared/utils';
import { mapToGpuDto } from '../gpu.mapper';
import { GpuRepository } from '../gpu.repository';
import { GpuService } from '../gpu.service';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
  UlBenchmarks = 'benchmarks.ul.com',
  VideocardBenchmark = 'www.videocardbenchmark.net',
}

@Injectable()
export class GpuImportService {
  constructor(
    private gpuService: GpuService,
    private gpuRepository: GpuRepository,
  ) {}

  async scrapeDetails(request: ScrapeGpuDetailsRequest) {
    const result: ScrapeGpuDetailsResponse = { gpu: {} };

    for (let i = 0; i < request.sources.length; ++i) {
      deepMergeObjects(
        result,
        await this.scrapeDetailsFromSource(request.sources[i]),
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
        existingGpus.push({
          ...gpuToImport,
          id: gpuEntity.id,
          slug: gpuEntity.slug,
        });
      }
    }

    return { newGpus, existingGpus } as PreviewImportGpusResponse;
  }

  async import(request: ImportGpusRequest, ctx: Context) {
    const { gpus } = request;
    for (let i = 0; i < gpus.length; ++i) {
      const gpu = gpus[i];
      if (gpu.id != null) {
        await this.gpuService.update(gpu.id, gpu, ctx);
      } else {
        await this.gpuService.create(gpu, ctx);
      }
    }
  }

  private async scrapeDetailsFromSource(source: GpuDataSource) {
    const parsedUrl = new URL(source.url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await scrapeTechPowerUpGpuDetails({ url: source.url });
    } else if (parsedUrl.hostname === Importers.UlBenchmarks) {
      return await scrapeUlBenchmarksGpuDetails({ url: source.url });
    } else if (parsedUrl.hostname === Importers.VideocardBenchmark) {
      return await scrapeVideocardBenchmarksGpuDetails({ url: source.url });
    } else {
      throw badRequestError();
    }
  }
}
