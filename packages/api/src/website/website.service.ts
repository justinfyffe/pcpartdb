import { Injectable } from '@nestjs/common';
import {
  GetSitemapProductSlugsRequest,
  GetSitemapProductSlugsResponse,
  getSitemapProductSlugsSchema,
  UploadSitemapRequest,
} from '@pcpartdb/shared';
import { ProductRepository } from '../product/product.repository';
import { Context } from '../shared/context';
import * as fileUtils from '../shared/utils';
import { validate } from '../shared/validation/validate';

@Injectable()
export class WebsiteService {
  constructor(private productRepository: ProductRepository) {}

  async uploadSitemap(request: UploadSitemapRequest, _ctx: Context) {
    const originalPath = fileUtils.uploadsPath(request.tempPath);
    const sitemapPath = fileUtils.sitemapsPath(request.originalFileName);

    if (fileUtils.exists(sitemapPath)) {
      await fileUtils.remove(sitemapPath);
    }
    await fileUtils.move(originalPath, sitemapPath);
  }

  async uploadPrioritySitemap(request: UploadSitemapRequest, _ctx: Context) {
    const originalPath = fileUtils.uploadsPath(request.tempPath);
    const sitemapPath = fileUtils.prioritySitemapsPath(
      request.originalFileName,
    );

    if (fileUtils.exists(sitemapPath)) {
      await fileUtils.remove(sitemapPath);
    }
    await fileUtils.move(originalPath, sitemapPath);
  }

  async getSitemapProductSlugs(
    request: GetSitemapProductSlugsRequest,
    ctx: Context,
  ) {
    validate(request, getSitemapProductSlugsSchema);

    const results = await this.productRepository.listSitemapProductSlugs(
      request.productType,
      request.hasParent ?? false,
      ctx,
    );

    return {
      slugs: results.map((value) => ({
        productId: value.id,
        slug: value.slug,
        lastModification: value.updatedAt.getTime(),
        releaseDate:
          value.cpuFields?.releaseDateValue ||
          value.gpuFields?.releaseDateValue ||
          null,
        marketSegment:
          value.cpuFields?.marketSegmentValue ||
          value.gpuFields?.marketSegmentValue ||
          null,
        hasBenchmarks: !!value.benchmarks?.length,
      })),
    } as GetSitemapProductSlugsResponse;
  }
}
