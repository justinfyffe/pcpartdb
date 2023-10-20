import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AutocompleteProductsRequest,
  CreateProductRequest,
  GetProductRequest,
  ListProductsRequest,
  ProductFieldKey,
  ProductType,
  ScrapeProductRequest,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private db: Database, private service: ProductService) {}

  @Get()
  async list(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const req: ListProductsRequest = JSON.parse(reqJson);
    const ret = await this.db.transaction(
      async () => {
        return await this.service.list(
          req,
          {
            fields: this.getListFields(req.productType),
            includeAdditionalData: true,
          },
          ctx,
        );
      },
      { ctx },
    );
    return ret;
  }

  @Get('autocomplete')
  async autocomplete(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const req: AutocompleteProductsRequest = JSON.parse(reqJson);
    return await this.service.autocomplete(
      req,
      { fields: ['msrp', 'marketSegment', 'releaseDate'] },
      ctx,
    );
  }

  @Get('all')
  @UseGuards(StaffGuard)
  async listAll(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const req: ListProductsRequest = JSON.parse(reqJson);
    const ret = await this.db.transaction(
      async () => {
        return await this.service.list(
          req,
          { fields: ['msrp'], includeBenchmarks: true, skipCount: true },
          ctx,
        );
      },
      { ctx, timeout: 60_000 },
    );
    return ret;
  }

  @Post('scrape')
  @UseGuards(StaffGuard)
  async scrape(@Body() request: ScrapeProductRequest, @Ctx() ctx: Context) {
    return await this.service.scrape(request, ctx);
  }

  @Get(':id')
  @UseGuards(StaffGuard)
  async getProduct(
    @Param('id') idStr: string,
    @Query('req') reqJson: string,
    @Ctx() ctx: Context,
  ) {
    const id = Number(idStr);
    const req: GetProductRequest = JSON.parse(reqJson);
    return await this.db.transaction(
      async () => {
        const product = await this.service.getById({ ...req, id }, ctx);
        return product;
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() req: CreateProductRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        return await this.service.create(req, ctx);
      },
      { ctx },
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(
    @Param('id') idStr: string,
    @Body() req: UpdateProductRequest,
    @Ctx() ctx: Context,
  ) {
    const id = Number(idStr);
    return await this.db.transaction(
      async () => {
        return await this.service.update(id, req, ctx);
      },
      { ctx },
    );
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') idStr: string, @Ctx() ctx: Context) {
    const id = Number(idStr);
    return await this.db.transaction(
      async () => {
        return await this.service.delete(id, ctx);
      },
      { ctx },
    );
  }

  private getListFields(productType: ProductType): ProductFieldKey[] {
    switch (productType) {
      case ProductType.Cpu:
        return [
          'performanceRating',
          'performancePerMsrp',
          'releaseDate',
          'marketSegment',
          'msrp',
        ];
      case ProductType.Gpu:
        return [
          'performanceRating',
          'performancePerMsrp',
          'releaseDate',
          'gpuCoreBaseClock',
          'gpuCoreBoostClock',
          'length',
          'slotWidth',
          'width',
          'height',
          'tdp',
          'marketSegment',
          'msrp',
        ];
      default:
        throw new Error(
          `Invalid product type for getting list fields: ${productType}`,
        );
    }
  }
}
