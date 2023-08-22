import {
  Body,
  Controller,
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
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { MULTER_OPTIONS } from '../shared/utils';
import { WebsiteService } from './website.service';

@Controller('website')
export class WebsiteController {
  constructor(private service: WebsiteService, private db: Database) {}

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
}
