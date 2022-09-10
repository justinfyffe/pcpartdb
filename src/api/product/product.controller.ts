import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import type {
  ProductRequest,
  ProductResponse,
  ProductsResponse,
  ProductType,
} from '../../types/product';
import { StaffGuard } from '../auth/staff.guard';
import { transaction } from '../db/database';
import { normalize } from '../shared/types/normalize';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private service: ProductService) {}

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  async autocomplete(
    @Query('type') type: ProductType,
    @Query('query') query: string,
  ) {
    return normalize(
      await transaction((trx) =>
        this.service.autocomplete(type, query ?? '', { trx }),
      ),
    ) as ProductsResponse;
  }

  @Get()
  async list() {
    return normalize(
      await transaction((trx) => this.service.list({ trx })),
    ) as ProductsResponse;
  }

  @Get(':idOrSlug')
  async get(@Param('idOrSlug') idOrSlug: number | string) {
    return normalize(
      await transaction((trx) => this.service.get(idOrSlug, { trx })),
    ) as ProductResponse;
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: ProductRequest) {
    return normalize(
      await transaction((trx) => this.service.create(body, { trx })),
    ) as ProductResponse;
  }

  @Put(':id')
  @Patch(':id')
  @UseGuards(StaffGuard)
  async update(@Param('id') id: number, @Body() body: ProductRequest) {
    return normalize(
      await transaction((trx) => this.service.update(id, body, { trx })),
    ) as ProductResponse;
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') id: number) {
    return await transaction((trx) => this.service.delete(id, { trx }));
  }
}
