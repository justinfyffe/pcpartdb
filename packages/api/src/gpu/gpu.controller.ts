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
  ImportGpuDataRequest,
  ListGpusRequest,
  UpdateGpuRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/types/validate';
import { GpuSpecsEntity } from './gpu.entity';
import { GpuService } from './gpu.service';
import {
  autocompleteGpusRequestValidator,
  autocompleteSpecsRequestValidator,
  createGpuRequestValidator,
  listGpusRequestValidator,
  updateGpuRequestValidator,
} from './gpu.validators';
import { GpuImporterService } from './gpu-importer.service';

@Controller('gpus')
export class GpuController {
  constructor(
    private db: Database,
    private gpuService: GpuService,
    private gpuImporterService: GpuImporterService,
  ) {}

  @Get()
  async list(@Query('q') q: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const data = JSON.parse(q) as ListGpusRequest;
        validate(data, listGpusRequestValidator);
        return await this.gpuService.list(
          { ...data, includeRanks: true, includeImages: false },
          ctx,
        );
      },
      { ctx },
    );
  }

  @Get('autocomplete')
  async autocomplete(@Query('query') query: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate({ query }, autocompleteGpusRequestValidator);
        return await this.gpuService.autocomplete(query ?? '', ctx);
      },
      { ctx },
    );
  }

  @Get('specs/autocomplete')
  @UseGuards(StaffGuard)
  async autocompleteSpecs(
    @Query('key') key: string,
    @Query('value') query: string,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        validate({ key, query }, autocompleteSpecsRequestValidator);
        return await this.gpuService.autocompleteSpec(
          key as keyof GpuSpecsEntity,
          query ?? '',
          ctx,
        );
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

  @Post('import')
  @UseGuards(StaffGuard)
  async importData(@Body() body: ImportGpuDataRequest) {
    return this.gpuImporterService.importData(body);
  }
}
