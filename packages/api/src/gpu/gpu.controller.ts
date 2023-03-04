import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateGpuRequest,
  ImportGpuDataRequest,
  ListGpusRequest,
  UpdateGpuRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { ApiRequest } from '../shared/http';
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
    private gpuService: GpuService,
    private gpuImporterService: GpuImporterService,
  ) {}

  @Get()
  async list(@Query('q') q: string, @Req() request: ApiRequest) {
    const ctx = request.context;
    const data = JSON.parse(q) as ListGpusRequest;
    validate(data, listGpusRequestValidator);
    return await this.gpuService.list(
      { ...data, includeRanks: true, includeImages: false },
      ctx,
    );
  }

  @Get('autocomplete')
  async autocomplete(
    @Query('query') query: string,
    @Req() request: ApiRequest,
  ) {
    const ctx = request.context;
    validate({ query }, autocompleteGpusRequestValidator);
    return await this.gpuService.autocomplete(query ?? '', ctx);
  }

  @Get('specs/autocomplete')
  @UseGuards(StaffGuard)
  async autocompleteSpecs(
    @Query('key') key: string,
    @Query('value') query: string,
    @Req() request: ApiRequest,
  ) {
    const ctx = request.context;
    validate({ key, query }, autocompleteSpecsRequestValidator);
    return await this.gpuService.autocompleteSpec(
      key as keyof GpuSpecsEntity,
      query ?? '',
      ctx,
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateGpuRequest, @Req() request: ApiRequest) {
    const ctx = request.context;
    validate(body, createGpuRequestValidator);
    return await this.gpuService.create(body, ctx);
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateGpuRequest,
    @Req() request: ApiRequest,
  ) {
    const id = Number(idStr);
    const ctx = request.context;
    validate(body, updateGpuRequestValidator);
    return await this.gpuService.update(id, body, ctx);
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') idStr: string, @Req() request: ApiRequest) {
    const id = Number(idStr);
    const ctx = request.context;
    return await this.gpuService.delete(id, ctx);
  }

  @Post('import')
  @UseGuards(StaffGuard)
  async importData(
    @Body() body: ImportGpuDataRequest,
    @Req() _request: ApiRequest,
  ) {
    return this.gpuImporterService.importData(body);
  }
}
