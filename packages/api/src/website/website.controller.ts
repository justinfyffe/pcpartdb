import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  GetSitemapProductSlugsRequest,
  UploadSitemapRequest,
  UploadSitemapsRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { CacheService } from '../shared/cache/cache.service';
import { Context, Ctx } from '../shared/context';
import { MULTER_OPTIONS } from '../shared/utils';
import { WebsiteService } from './website.service';

@Controller('website')
export class WebsiteController {
  constructor(
    private service: WebsiteService,
    private cacheService: CacheService,
    private db: Database,
  ) {}

  @Post('sitemaps')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async uploadSitemaps(
    @Body() body: UploadSitemapsRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.service.uploadSitemaps(body, ctx);
  }

  @Post('sitemap')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async uploadSitemap(@Body() body: UploadSitemapRequest, @Ctx() ctx: Context) {
    return await this.service.uploadSitemap(body, ctx);
  }

  @Get('sitemap/product-slugs')
  @UseGuards(StaffGuard)
  async getSitemapProductSlugs(@Query('req') req: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const body = JSON.parse(req) as GetSitemapProductSlugsRequest;
        return await this.service.getSitemapProductSlugs(body, ctx);
      },
      { ctx },
    );
  }

  @Delete('cache')
  @UseGuards(StaffGuard)
  async clearCache() {
    await this.cacheService.invalidateAll();
    return {
      cacheSize: await this.cacheService.size(),
    };
  }
}
