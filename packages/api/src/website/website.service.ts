import { Injectable } from '@nestjs/common';
import {
  GetSitemapProductSlugsRequest,
  GetSitemapProductSlugsResponse,
  getSitemapProductSlugsSchema,
  UploadSitemapRequest,
  UploadSitemapsRequest,
} from '@pcpartdb/shared';
import * as tar from 'tar';
import { ProductRepository } from '../product/product.repository';
import { Context } from '../shared/context';
import * as fileUtils from '../shared/utils';
import { validate } from '../shared/validation/validate';

@Injectable()
export class WebsiteService {
  constructor(private productRepository: ProductRepository) {}

  async uploadSitemaps(request: UploadSitemapsRequest, _ctx: Context) {
    const originalPath = fileUtils.uploadsPath(request.tempPath);
    const sitemapPath = fileUtils.sitemapsPath('sitemaps.tgz');

    await fileUtils.move(originalPath, sitemapPath);
    await tar.x({
      cwd: fileUtils.sitemapsPath(),
      file: sitemapPath,
    });
  }

  async uploadSitemap(request: UploadSitemapRequest, _ctx: Context) {
    const originalPath = fileUtils.uploadsPath(request.tempPath);
    const sitemapPath = fileUtils.sitemapsPath(request.originalFileName);

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
        slug: value.slug,
        lastModification: value.updatedAt.getTime(),
      })),
    } as GetSitemapProductSlugsResponse;
  }
}
