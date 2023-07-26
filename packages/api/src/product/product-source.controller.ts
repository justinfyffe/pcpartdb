import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApplyProductSourcesToProductRequest,
  AutocompleteProductSourcesRequest,
  ListProductSourceGroupsResponse,
  ListProductSourcesQuery,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/validation/validate';
import {
  applyProductSourcesToProductRequestValidator,
  autocompleteProductSourcesRequestValidator,
  listProductSourcesQueryValidator,
  upsertProductSourcesValidator,
} from './product.validators';
import { ProductSourceService } from './product-source.service';

@Controller('products/sources')
export class ProductSourceController {
  constructor(private db: Database, private service: ProductSourceService) {}

  @Get('groups')
  @UseGuards(StaffGuard)
  async list(@Query('q') q: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const query =
          q != null ? (JSON.parse(q) as ListProductSourcesQuery) : {};
        validate(query, listProductSourcesQueryValidator);
        const sourceGroups = await this.service.listGroups({ query }, ctx);
        const totalSourceGroups = await this.service.countGroups(
          { query },
          ctx,
        );

        return {
          query,
          sourceGroups,
          totalSourceGroups,
        } as ListProductSourceGroupsResponse;
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
  async create(@Body() body: UpsertProductSourcesRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, upsertProductSourcesValidator);
        await this.service.upsert(body, ctx);
      },
      { ctx },
    );
  }

  @Put('apply')
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
}
