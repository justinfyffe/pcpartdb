import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type {
  ProductSpecKey,
  ProductSpecsResponse,
} from '../../../types/product-spec';
import { StaffGuard } from '../../auth/staff.guard';
import { transaction } from '../../db/database';
import { normalize } from '../../shared/types/normalize';
import { ProductSpecService } from './product-spec.service';

@Controller('products/specs')
export class ProductSpecController {
  constructor(private service: ProductSpecService) {}

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  async autocomplete(
    @Query('key') key: ProductSpecKey,
    @Query('value') value: string | number,
  ) {
    return normalize(
      await transaction((trx) =>
        this.service.autocomplete(key, value, { trx }),
      ),
    ) as ProductSpecsResponse;
  }
}
