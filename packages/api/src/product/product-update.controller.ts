import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProductUpdateRequest } from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/types/validate';
import { createProductUpdateValidator } from './product.validators';
import { ProductUpdateService } from './product-update.service';

@Controller('products/updates')
export class ProductUpdateController {
  constructor(private db: Database, private service: ProductUpdateService) {}

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateProductUpdateRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, createProductUpdateValidator);
        await this.service.create(body, ctx);
      },
      { ctx },
    );
  }
}
