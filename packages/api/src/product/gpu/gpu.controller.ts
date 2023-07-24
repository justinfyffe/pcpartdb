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
import { GpuEntity } from '@pcpartdb/database';
import {
  CreateGpuRequest,
  ListGpusOrder,
  ListGpusQuery,
  ListGpusResponse,
  ListGpusSort,
  ListRetailModelsResponse,
  ScrapeProductRequest,
  UpdateGpuRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../../auth/staff.guard';
import { Database } from '../../database';
import { Context, Ctx } from '../../shared/context';
import { validate } from '../../shared/types/validate';
import {
  autocompleteGpusRequestValidator,
  autocompleteSpecsRequestValidator,
} from './autocomplete/gpu-autcomplete.validators';
import { GpuAutocompleteService } from './autocomplete/gpu-autocomplete.service';
import { GpuService } from './gpu.service';
import {
  createGpuRequestValidator,
  listGpusQueryValidator,
  updateGpuRequestValidator,
} from './gpu.validators';
import { GpuScrapeService } from './scrape/gpu-scrape.service';

@Controller('products/gpus')
export class GpuController {
  constructor(
    private db: Database,
    private gpuService: GpuService,
    private gpuAutocompleteService: GpuAutocompleteService,
    private gpuScrapeService: GpuScrapeService,
  ) {}

  @Get()
  async list(@Query('q') q: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const query = q != null ? (JSON.parse(q) as ListGpusQuery) : {};
        validate(query, listGpusQueryValidator);
        const gpus = await this.gpuService.list(
          {
            query,
            fields: [
              'company',
              'performanceScore',
              'valueScore',
              'releaseDate',
              'marketSegment',
              'launchPrice',
            ],
            includeRanks: ['performanceRank', 'valueRank'],
            includeImages: false,
          },
          ctx,
        );
        const totalGpus = await this.gpuService.count({ query }, ctx);

        const retailModelCounts = await this.gpuService.countRetailModels(
          { chipsetIds: gpus.map((gpu) => gpu.id) },
          ctx,
        );

        return {
          query,
          gpus,
          totalGpus,
          contentData: { retailModelCounts },
        } as ListGpusResponse;
      },
      { ctx },
    );
  }

  @Get('autocomplete')
  async autocomplete(@Query('query') query: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate({ query }, autocompleteGpusRequestValidator);
        return await this.gpuAutocompleteService.autocomplete(query ?? '', ctx);
      },
      { ctx },
    );
  }

  @Get('autocomplete/specs')
  @UseGuards(StaffGuard)
  async autocompleteSpecs(
    @Query('key') key: string,
    @Query('value') query: string,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        validate({ key, query }, autocompleteSpecsRequestValidator);
        return await this.gpuAutocompleteService.autocompleteSpec(
          key as keyof Omit<GpuEntity, 'chipset' | 'retailModels' | 'images'>,
          query ?? '',
          ctx,
        );
      },
      { ctx },
    );
  }

  @Post('scrape')
  @UseGuards(StaffGuard)
  async scrape(@Body() body: ScrapeProductRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.gpuScrapeService.scrapeGpu(body, ctx),
      { ctx },
    );
  }

  @Get(':id/retail-models')
  async listRetailModels(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const chipsetId = Number(idStr);
        const retailModels = await this.gpuService.list(
          {
            query: {
              filter: { chipsetId },
              orderBy: { sort: ListGpusSort.Name, order: ListGpusOrder.Asc },
              pagination: { limit: 1_000 },
            },
            fields: [
              'company',
              'coreClockSpeedBase',
              'coreClockSpeedBoost',
              'length',
              'slotWidth',
              'width',
              'height',
              'thermalDesignPower',
            ],
          },
          ctx,
        );

        return { retailModels } as ListRetailModelsResponse;
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
}
