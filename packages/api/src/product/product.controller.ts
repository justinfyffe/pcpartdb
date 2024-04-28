import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AutocompleteProductsRequest,
  compactObject,
  CreateProductRequest,
  getPreferredBenchmark,
  GetProductRequest,
  GetRelativeDataProductsRequest,
  ListProductsRequest,
  ProductFieldKey,
  ProductType,
  relativeDataProductsNormalizr,
  ScrapeProductRequest,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { normalize } from 'normalizr';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { TimerInterceptor } from '../shared/timer/timer.interceptor';
import { ProductService } from './product.service';
import { RelativeDataProductsService } from './relative-data-products.service';

@Controller('products')
export class ProductController {
  constructor(
    private db: Database,
    private service: ProductService,
    private relativeDataProductsService: RelativeDataProductsService,
  ) {}

  @Get()
  @UseInterceptors(TimerInterceptor)
  async list(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const req: ListProductsRequest = JSON.parse(reqJson);
    const productType = req.query.filter?.productType;
    if (productType == null) {
      throw new Error('Missing product type for list products');
    }

    const response = await this.service.list(
      req,
      {
        fields: this.getListFields(productType),
        includeBenchmarks: [
          getPreferredBenchmark(ctx.config?.userSettings, productType),
        ],
        includeRanks: true,
      },
      ctx,
    );
    return response;
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
    return await this.service.list(
      req,
      {
        fields: ['marketSegment', 'msrp'],
        includeBenchmarks: true,
        skipCount: true,
      },
      ctx,
    );
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
    const product = await this.service.getById({ ...req, id }, ctx);
    return product;
  }

  @Post('relative')
  @HttpCode(HttpStatus.OK)
  async getRelativeProducts(
    @Body() request: GetRelativeDataProductsRequest,
    @Ctx() ctx: Context,
  ) {
    const response =
      await this.relativeDataProductsService.getRelativeDataProducts(
        request,
        ctx,
      );
    const compact = compactObject(response);
    return normalize(compact, relativeDataProductsNormalizr);
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
        return ['releaseDate', 'marketSegment', 'msrp'];
      case ProductType.Gpu:
        return ['releaseDate', 'marketSegment', 'msrp'];
      default:
        throw new Error(
          `Invalid product type for getting list fields: ${productType}`,
        );
    }
  }
}
