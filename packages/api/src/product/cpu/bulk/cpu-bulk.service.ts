import { Injectable } from '@nestjs/common';
import { mapToCpuDto } from '@pcpartdb/database';
import {
  Cpu,
  CpuDiff,
  ImportProductsRequest,
  PreviewImportProductsRequest,
  PreviewImportProductsResponse,
} from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { Context } from '../../../shared/context';
import * as fileUtils from '../../../shared/utils';
import { CpuRepository } from '../cpu.repository';
import { CpuService } from '../cpu.service';

@Injectable()
export class CpuBulkService {
  constructor(
    private cpuService: CpuService,
    private cpuRepository: CpuRepository,
  ) {}

  async previewImportBulk(request: PreviewImportProductsRequest, ctx: Context) {
    const { tempPath } = request;

    const path = fileUtils.uploadsPath(tempPath);
    const json = await fsPromises.readFile(path, 'utf-8');
    const cpusToImport: Cpu[] = JSON.parse(json);
    await fileUtils.remove(path);

    const diffs: CpuDiff[] = [];

    for (let i = 0; i < cpusToImport.length; ++i) {
      const cpuToImport = cpusToImport[i];
      const company = cpuToImport.company?.value;
      const name = cpuToImport.name;
      const slug = cpuToImport.slug;

      let cpuEntity = await this.cpuRepository.findBySlug(slug, {}, ctx);
      cpuEntity =
        cpuEntity ||
        (await this.cpuRepository.findByCompanyAndName(company, name, ctx));
      cpuEntity = cpuEntity || (await this.cpuRepository.findByName(name, ctx));
      const original = mapToCpuDto(cpuEntity, { includeSources: true });

      const updated = {
        ...cpuToImport,
        id: original?.id,
        slug: original?.slug || slug,
      };

      diffs.push({ original, updated });
    }

    return { diffs } as PreviewImportProductsResponse;
  }

  async importBulk(request: ImportProductsRequest, ctx: Context) {
    const { products } = request;

    for (let i = 0; i < products.length; ++i) {
      const cpu = products[i] as Cpu;
      if (cpu.id != null) {
        await this.cpuService.update(cpu.id, cpu, ctx);
      } else {
        await this.cpuService.create(cpu, ctx);
      }
    }
  }
}
