import { Injectable } from '@nestjs/common';
import {
  GetSitemapProductSlugsRequest,
  GetSitemapProductSlugsResponse,
  GpuProductType,
  ProductType,
  UploadSitemapRequest,
} from '@pcpartdb/shared';
import extract from 'extract-zip';
import * as fs from 'fs';
import path from 'path';
import { CpuRepository } from '../product/cpu/cpu.repository';
import { GpuRepository } from '../product/gpu/gpu.repository';
import { Context } from '../shared/context';
import { notFoundError } from '../shared/error';
import { validate } from '../shared/validation/validate';
import { getSitemapProductSlugsValidator } from './website.validators';

const CWD_PATH = path.resolve(process.cwd());
const SITEMAPS_PATH = path.resolve(
  path.join(CWD_PATH, '../..', 'data', 'sitemaps'),
);
const SITEMAPS_STAGING_PATH = path.resolve(
  path.join(CWD_PATH, '../..', 'data', 'sitemaps-staging'),
);

@Injectable()
export class WebsiteService {
  constructor(
    private cpuRepository: CpuRepository,
    private gpuRepository: GpuRepository,
  ) {}

  async uploadSitemap(request: UploadSitemapRequest, _ctx: Context) {
    await extract(request.tempPath, { dir: SITEMAPS_STAGING_PATH });
    await fs.rmdirSync(SITEMAPS_PATH);
    await fs.renameSync(SITEMAPS_STAGING_PATH, SITEMAPS_PATH);
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
