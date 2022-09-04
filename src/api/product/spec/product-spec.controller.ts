import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { ProductSpecKey } from '../../../types/product-spec';
import { StaffGuard } from '../../auth/staff.guard';
import { transaction } from '../../db/database';
import { ProductSpecService } from './product-spec.service';

@Controller('products/specs')
export class ProductSpecController {
  constructor(private service: ProductSpecService) {}

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  async autocomplete(
    @Query('key') key: ProductSpecKey,
    @Query('value') value: string,
  ) {
    return await transaction((trx) =>
      this.service.autocomplete(key, value ?? '', { trx }),
    );
  }
}
