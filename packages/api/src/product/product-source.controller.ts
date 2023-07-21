import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateProductSourcesRequest } from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Context, Ctx } from '../shared/context';

@Controller('product/sources')
export class ProductSourceController {
  constructor() {}

  @Post('bulk')
  @UseGuards(StaffGuard)
  async createBulk(
    @Body() body: CreateProductSourcesRequest,
    @Ctx() ctx: Context,
  ) {
    //
  }
}
