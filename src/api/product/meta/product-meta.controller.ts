import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ProductMetaKey,
  ProductMetaResponse,
} from '../../../types/product-meta';
import { StaffGuard } from '../../auth/staff.guard';
import { transaction } from '../../db/database';
import { normalize } from '../../shared/types/normalize';
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
    return normalize(
      await transaction((trx) =>
        this.service.autocomplete(key, value ?? '', { trx }),
      ),
    ) as ProductMetaResponse;
  }
}
