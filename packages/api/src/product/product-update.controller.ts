import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApproveProductUpdateRequest,
  CreateProductUpdateRequest,
  ListProductUpdatesRequest,
  RejectProductUpdateRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { ProductUpdateService } from './product-update.service';

@Controller('products/updates')
export class ProductUpdateController {
  constructor(private db: Database, private service: ProductUpdateService) {}

  @Get()
  @UseGuards(StaffGuard)
  async list(@Query('req') req: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const request: ListProductUpdatesRequest =
          req != null ? JSON.parse(req) : null;
        return await this.service.list(request, ctx);
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateProductUpdateRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        await this.service.create(body, ctx);
      },
      { ctx },
    );
  }

  @Post(':id/approve')
  @UseGuards(StaffGuard)
  async approve(
    @Param() idStr: string,
    @Body() body: ApproveProductUpdateRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        await this.service.approve(id, body, ctx);
      },
      { ctx },
    );
  }

  @Post(':id/reject')
  @UseGuards(StaffGuard)
  async reject(
    @Param() idStr: string,
    @Body() body: RejectProductUpdateRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        await this.service.reject(id, body, ctx);
      },
      { ctx },
    );
  }
}
