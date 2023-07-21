import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProductUpdateRequest } from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Context, Ctx } from '../shared/context';

@Controller('product/updates')
export class ProductUpdateController {
  constructor() {}

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateProductUpdateRequest, @Ctx() ctx: Context) {
    //
  }
}
