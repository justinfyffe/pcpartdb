import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StaffGuard } from '@server/auth/staff-guard';
import { transaction } from '@server/db/database';
import type { ProductSpecKey } from '@shared/product-spec';
import { ProductSpecService } from './product-spec-service';

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
