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
import { dto } from '../shared/types/dto';
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
    return await transaction(async (trx) => {
      const results = await this.service.autocomplete(type, query ?? '', {
        trx,
      });
      return dto(results);
    });
  }

  @Get()
  async list() {
    return await transaction(async (trx) => {
      const results = await this.service.list({ trx });
      return dto(results);
    });
  }

  @Get(':idOrSlug')
  async get(@Param('idOrSlug') idOrSlug: number | string) {
    return await transaction(async (trx) => {
      const product = await this.service.get(idOrSlug, { trx });
      return dto(product);
    });
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: ProductRequest) {
    return await transaction(async (trx) => {
      const product = await this.service.create(body, { trx });
      return dto(product);
    });
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(@Param('id') id: number, @Body() body: ProductRequest) {
    return await transaction(async (trx) => {
      const product = await this.service.update(id, body, { trx });
      return dto(product);
    });
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') id: number) {
    return await transaction((trx) => this.service.delete(id, { trx }));
  }
}
