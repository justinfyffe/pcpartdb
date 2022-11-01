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
import { StaffGuard } from '@server/auth/staff-guard';
import { transaction } from '@server/db/database';
import { serializeAsync } from '@server/shared/types/serialize';
import type { ProductRequest, ProductType } from '@shared/product';
import { productService } from './product-service';

@Controller('products')
export class ProductController {
  constructor() {}

  @Get('autocomplete')
  async autocomplete(
    @Query('type') type: ProductType,
    @Query('query') query: string,
  ) {
    return transaction((trx) =>
      serializeAsync(productService.autocomplete(type, query ?? '', { trx })),
    );
  }

  @Get()
  async list(@Query('type') type: ProductType) {
    return transaction((trx) =>
      serializeAsync(productService.list(type, { trx })),
    );
  }

  @Get(':idOrSlug')
  async get(@Param('idOrSlug') idOrSlug: number | string) {
    return transaction((trx) =>
      serializeAsync(productService.get(idOrSlug, { trx })),
    );
  }

  @Get('comparison/:idsOrSlugs')
  async getComparison(@Param('idsOrSlugs') idsOrSlugs: string) {
    return transaction((trx) =>
      serializeAsync(productService.getComparison(idsOrSlugs, { trx })),
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: ProductRequest) {
    return transaction((trx) =>
      serializeAsync(productService.create(body, { trx })),
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(@Param('id') id: number, @Body() body: ProductRequest) {
    return transaction((trx) =>
      serializeAsync(productService.update(id, body, { trx })),
    );
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') id: number) {
    return transaction((trx) => productService.delete(id, { trx }));
  }
}
