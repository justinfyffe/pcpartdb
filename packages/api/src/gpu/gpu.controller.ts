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
import {
  CreateGpuRequest,
  ListGpusRequest,
  ListGpusResponse,
  UpdateGpuRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/types/validate';
import { GpuRank, GpuService } from './gpu.service';
import {
  createGpuRequestValidator,
  listGpusRequestValidator,
  updateGpuRequestValidator,
} from './gpu.validators';
import { GpuImportService } from './import/gpu-import.service';

@Controller('gpus')
export class GpuController {
  constructor(
    private db: Database,
    private gpuService: GpuService,
    private gpuImporterService: GpuImportService,
  ) {}

  @Get()
  async list(@Query('q') q: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const data = JSON.parse(q) as ListGpusRequest;
        validate(data, listGpusRequestValidator);
        const gpus = await this.gpuService.list(
          {
            ...data,
            fields: data.fields || [],
            includeRanks: [GpuRank.Performance, GpuRank.Value],
            includeImages: false,
          },
          ctx,
        );
        const totalGpus = await this.gpuService.count({ ...data }, ctx);

        return { gpus, totalGpus } as ListGpusResponse;
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateGpuRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, createGpuRequestValidator);
        return await this.gpuService.create(body, ctx);
      },
      { ctx },
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateGpuRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        validate(body, updateGpuRequestValidator);
        return await this.gpuService.update(id, body, ctx);
      },
      { ctx },
    );
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        return await this.gpuService.delete(id, ctx);
      },
      { ctx },
    );
  }

  @Post('refresh-ratings')
  @UseGuards(StaffGuard)
  async refreshRatings(@Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        await this.gpuService.refreshRatings(ctx);
      },
      { ctx },
    );
  }
}
