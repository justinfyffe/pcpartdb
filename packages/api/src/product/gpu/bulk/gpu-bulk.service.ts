import { Injectable } from '@nestjs/common';
import { mapToGpuDto } from '@pcpartdb/database';
import {
  Gpu,
  GpuDiff,
  ImportProductsRequest,
  PreviewImportGpusResponse,
  PreviewImportProductsRequest,
} from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { Context } from '../../../shared/context';
import * as fileUtils from '../../../shared/utils';
import { GpuRepository } from '../gpu.repository';
import { GpuService } from '../gpu.service';

@Injectable()
export class GpuBulkService {
  constructor(
    private gpuService: GpuService,
    private gpuRepository: GpuRepository,
  ) {}

  async previewImportBulk(request: PreviewImportProductsRequest, ctx: Context) {
    const { tempPath } = request;

    const path = fileUtils.uploadsPath(tempPath);
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
      gpuEntity = gpuEntity || (await this.gpuRepository.findByName(name, ctx));
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

  async importBulk(request: ImportProductsRequest, ctx: Context) {
    const { products } = request;

    for (let i = 0; i < products.length; ++i) {
      const gpu = products[i] as Gpu;
      if (gpu.id != null) {
        await this.gpuService.update(gpu.id, gpu, ctx);
      } else {
        await this.gpuService.create(gpu, ctx);
      }
    }
  }
}
