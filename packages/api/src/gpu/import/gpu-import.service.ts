import { Injectable } from '@nestjs/common';
import { mapToGpuDto } from '@pcpartdb/database';
import {
  scrapeTechPowerUpGpuDetails,
  scrapeUlBenchmarksGpuDetails,
  scrapeVideocardBenchmarksGpuDetails,
} from '@pcpartdb/scraper';
import {
  Gpu,
  GpuDataSource,
  GpuDiff,
  ImportGpusRequest,
  PreviewImportGpusResponse,
  ScrapeGpuDetailsRequest,
  ScrapeGpuDetailsResponse,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import * as fsPromises from 'fs/promises';
import { Context } from '../../shared/context';
import { badRequestError } from '../../shared/error';
import * as fileUtils from '../../shared/utils';
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

  async scrapeDetails(request: ScrapeGpuDetailsRequest, ctx: Context) {
    let result: ScrapeGpuDetailsResponse = { gpu: {} };

    for (let i = 0; i < request.sources.length; ++i) {
      result = deepmerge(
        result,
        await this.scrapeDetailsFromSource(request.sources[i], ctx),
      );
    }

    return result;
  }

  async previewImport(importFilename: string, ctx: Context) {
    const path = fileUtils.uploadsPath(importFilename);
    const json = await fsPromises.readFile(path, 'utf-8');
    const gpusToImport: Gpu[] = JSON.parse(json);
    await fileUtils.remove(path);

    const diffs: GpuDiff[] = [];

    for (let i = 0; i < gpusToImport.length; ++i) {
      const gpuToImport = gpusToImport[i];
      const company = gpuToImport.company?.value;
      const name = gpuToImport.name;
      const slug = gpuToImport.slug;

      let gpuEntity = await this.gpuRepository.findBySlug(slug, {}, ctx);
      gpuEntity =
        gpuEntity ||
        (await this.gpuRepository.findByCompanyAndName(company, name, ctx));
      const original = mapToGpuDto(gpuEntity, { includeSources: true });

      const updated = {
        ...gpuToImport,
        id: original?.id,
        slug: original?.slug || slug,
      };

      diffs.push({ original, updated });
    }

    return { diffs } as PreviewImportGpusResponse;
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

  private async scrapeDetailsFromSource(source: GpuDataSource, ctx: Context) {
    if (source.chipsetId != null) {
      return await this.scrapeDetailsFromGpu(source.chipsetId, ctx);
    } else if (source.url != null) {
      return await this.scrapeDetailsFromUrl(source.url);
    }

    return {} as ScrapeGpuDetailsResponse;
  }

  private async scrapeDetailsFromGpu(gpuId: number, ctx: Context) {
    const gpu = await this.gpuService.getById(gpuId, {}, ctx);
    return {
      gpu: { marketSegment: gpu.marketSegment },
    } as ScrapeGpuDetailsResponse;
  }

  private async scrapeDetailsFromUrl(url: string) {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await scrapeTechPowerUpGpuDetails({ url, proxy: true });
    } else if (parsedUrl.hostname === Importers.UlBenchmarks) {
      return await scrapeUlBenchmarksGpuDetails({ url, proxy: true });
    } else if (parsedUrl.hostname === Importers.VideocardBenchmark) {
      return await scrapeVideocardBenchmarksGpuDetails({ url, proxy: true });
    } else {
      throw badRequestError();
    }
  }
}
