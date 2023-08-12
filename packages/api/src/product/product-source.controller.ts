import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApplyProductSourcesToProductRequest,
  AutoArchiveProductSourcesRequest,
  AutocompleteProductSourcesRequest,
  ListProductSourcesRequest,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/validation/validate';
import {
  applyProductSourcesToProductRequestValidator,
  autocompleteProductSourcesRequestValidator,
  upsertProductSourcesValidator,
} from './product.validators';
import { ProductSourceService } from './product-source.service';

const AUTO_ARCHIVE_TIMEOUT = 30_000;

@Controller('products/sources')
export class ProductSourceController {
  constructor(private db: Database, private service: ProductSourceService) {}

  @Get('groups')
  @UseGuards(StaffGuard)
  async list(@Query('req') req: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const request: ListProductSourcesRequest =
          req != null ? JSON.parse(req) : null;
        return await this.service.listGroups(request, ctx);
      },
      { ctx },
    );
  }

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  async autocomplete(@Query('req') request: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const body: AutocompleteProductSourcesRequest =
          request != null
            ? (JSON.parse(request) as AutocompleteProductSourcesRequest)
            : null;

        validate(body, autocompleteProductSourcesRequestValidator);
        return await this.service.autocomplete(body, ctx);
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async upsert(@Body() body: UpsertProductSourcesRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, upsertProductSourcesValidator);
        await this.service.upsert(body, ctx);
      },
      { ctx },
    );
  }

  @Post('apply')
  @UseGuards(StaffGuard)
  async applyToProduct(
    @Body() body: ApplyProductSourcesToProductRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        validate(body, applyProductSourcesToProductRequestValidator);
        await this.service.applyToProduct(body, ctx);
      },
      { ctx },
    );
  }

  @Post('auto-archive')
  @UseGuards(StaffGuard)
  async autoArchive(
    @Body() body: AutoArchiveProductSourcesRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        await this.service.autoArchive(body, ctx);
      },
      { ctx, timeout: AUTO_ARCHIVE_TIMEOUT },
    );
  }
}
