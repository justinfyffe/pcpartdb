import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductMetaKey } from '../../../shared/product-meta';
import { StaffGuard } from '../../auth/staff.guard';
import { transaction } from '../../db/database';
import { ProductMetaService } from './product-meta.service';

@Controller('products/meta')
export class ProductMetaController {
  constructor(private service: ProductMetaService) {}

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  async autocomplete(
    @Query('key') key: ProductMetaKey,
    @Query('value') value: string,
  ) {
    return await transaction((trx) =>
      this.service.autocomplete(key, value ?? '', { trx }),
    );
  }
}
