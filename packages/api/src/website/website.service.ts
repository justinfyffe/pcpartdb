import { Injectable } from '@nestjs/common';
import {
  GetSitemapProductSlugsRequest,
  GetSitemapProductSlugsResponse,
  GpuProductType,
  ProductType,
  UploadSitemapRequest,
} from '@pcpartdb/shared';
import * as tar from 'tar';
import { CpuRepository } from '../product/cpu/cpu.repository';
import { GpuRepository } from '../product/gpu/gpu.repository';
import { Context } from '../shared/context';
import { notFoundError } from '../shared/error';
import * as fileUtils from '../shared/utils';
import { validate } from '../shared/validation/validate';
import { getSitemapProductSlugsValidator } from './website.validators';

@Injectable()
export class WebsiteService {
  constructor(
    private cpuRepository: CpuRepository,
    private gpuRepository: GpuRepository,
  ) {}

  async uploadSitemap(request: UploadSitemapRequest, _ctx: Context) {
    const originalPath = fileUtils.uploadsPath(request.tempPath);
    const sitemapPath = fileUtils.sitemapsPath('sitemap.tgz');

    await fileUtils.move(originalPath, sitemapPath);
    await tar.x({
      cwd: fileUtils.sitemapsPath(),
      file: sitemapPath,
    });
  }

  async getSitemapProductSlugs(
    request: GetSitemapProductSlugsRequest,
    ctx: Context,
  ) {
    validate(request, getSitemapProductSlugsValidator);

    if (request.productType === ProductType.Cpu) {
      return await this.getCpuProductSlugs(ctx);
    } else if (request.productType === ProductType.Gpu) {
      return await this.getGpuProductSlugs(request.gpuProductType, ctx);
    } else {
      throw notFoundError({ productType: request.productType });
    }
  }

  private async getCpuProductSlugs(ctx: Context) {
    const entities = await this.cpuRepository.listSitemapProductSlugs(ctx);
    return {
      slugs: entities.map((entity) => ({
        slug: entity.slug,
        lastModification: entity.updatedAt.getTime(),
      })),
    } as GetSitemapProductSlugsResponse;
  }

  private async getGpuProductSlugs(
    gpuProductType: GpuProductType,
    ctx: Context,
  ) {
    const entities = await this.gpuRepository.listSitemapProductSlugs(
      gpuProductType,
      ctx,
    );
    return {
      slugs: entities.map((entity) => ({
        slug: entity.slug,
        lastModification: entity.updatedAt.getTime(),
      })),
    } as GetSitemapProductSlugsResponse;
  }
}
