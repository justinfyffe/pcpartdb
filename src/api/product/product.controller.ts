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
import type { ProductRequest, ProductType } from '../../types/product';
import { StaffGuard } from '../auth/staff.guard';
import { transaction } from '../db/database';
import { serializeAsync } from '../shared/types/serialize';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private service: ProductService) {}

  @Get('autocomplete')
  async autocomplete(
    @Query('type') type: ProductType,
    @Query('query') query: string,
  ) {
    return transaction((trx) =>
      serializeAsync(this.service.autocomplete(type, query ?? '', { trx })),
    );
  }

  @Get()
  async list() {
    return transaction((trx) => serializeAsync(this.service.list({ trx })));
  }

  @Get(':idOrSlug')
  async get(@Param('idOrSlug') idOrSlug: number | string) {
    return transaction((trx) =>
      serializeAsync(this.service.get(idOrSlug, { trx })),
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: ProductRequest) {
    return transaction((trx) =>
      serializeAsync(this.service.create(body, { trx })),
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(@Param('id') id: number, @Body() body: ProductRequest) {
    return transaction((trx) =>
      serializeAsync(this.service.update(id, body, { trx })),
    );
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') id: number) {
    return transaction((trx) => this.service.delete(id, { trx }));
  }
}
