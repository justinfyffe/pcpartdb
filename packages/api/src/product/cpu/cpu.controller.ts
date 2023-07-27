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
import { CpuEntity } from '@pcpartdb/database';
import {
  CreateCpuRequest,
  ListCpusQuery,
  ListCpusResponse,
  ScrapeProductRequest,
  UpdateCpuRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../../auth/staff.guard';
import { Database } from '../../database';
import { Context, Ctx } from '../../shared/context';
import { validate } from '../../shared/types/validate';
import {
  autocompleteCpuDataRequestValidator,
  autocompleteCpusRequestValidator,
} from './autocomplete/cpu-autcomplete.validators';
import { CpuAutocompleteService } from './autocomplete/cpu-autocomplete.service';
import { CpuService } from './cpu.service';
import {
  createCpuRequestValidator,
  listCpusQueryValidator,
  updateCpuRequestValidator,
} from './cpu.validators';
import { CpuScrapeService } from './scrape/cpu-scrape.service';

@Controller('products/cpus')
export class CpuController {
  constructor(
    private db: Database,
    private cpuService: CpuService,
    private cpuAutocompleteService: CpuAutocompleteService,
    private cpuScrapeService: CpuScrapeService,
  ) {}

  @Get()
  async list(@Query('q') q: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const query = q != null ? (JSON.parse(q) as ListCpusQuery) : {};
        validate(query, listCpusQueryValidator);
        const cpus = await this.cpuService.list(
          {
            query,
            fields: [
              'company',
              'performanceScore',
              'valueScore',
              'releaseDate',
              'marketSegments',
              'launchPrice',
            ],
            includeRanks: ['performanceRank', 'valueRank'],
            includeImages: false,
          },
          ctx,
        );
        const totalCpus = await this.cpuService.count({ query }, ctx);

        return {
          query,
          cpus,
          totalCpus,
        } as ListCpusResponse;
      },
      { ctx },
    );
  }

  @Get('autocomplete')
  async autocomplete(@Query('query') query: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate({ query }, autocompleteCpusRequestValidator);
        return await this.cpuAutocompleteService.autocomplete(query ?? '', ctx);
      },
      { ctx },
    );
  }

  @Get('autocomplete/field')
  @UseGuards(StaffGuard)
  async autocompleteField(
    @Query('key') key: string,
    @Query('value') query: string,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        validate({ key, query }, autocompleteCpuDataRequestValidator);
        return await this.cpuAutocompleteService.autocompleteField(
          key as keyof Omit<CpuEntity, 'images'>,
          query ?? '',
          ctx,
        );
      },
      { ctx },
    );
  }

  @Post('scrape')
  @UseGuards(StaffGuard)
  async scrape(@Body() body: ScrapeProductRequest) {
    return await this.cpuScrapeService.scrapeCpu(body);
  }

  @Get(':id')
  @UseGuards(StaffGuard)
  async get(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        return await this.cpuService.getById(id, { includeImages: true }, ctx);
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() body: CreateCpuRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, createCpuRequestValidator);
        return await this.cpuService.create(body, ctx);
      },
      { ctx },
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(
    @Param('id') idStr: string,
    @Body() body: UpdateCpuRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        validate(body, updateCpuRequestValidator);
        return await this.cpuService.update(id, body, ctx);
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
        return await this.cpuService.delete(id, ctx);
      },
      { ctx },
    );
  }
}
