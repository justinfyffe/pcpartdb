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
  CreateCpuRequest,
  ListCpusQuery,
  ListCpusResponse,
  UpdateCpuRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../../auth/staff.guard';
import { Database } from '../../database';
import { Context, Ctx } from '../../shared/context';
import { validate } from '../../shared/types/validate';
import { CpuService } from './cpu.service';
import {
  createCpuRequestValidator,
  listCpusQueryValidator,
  updateCpuRequestValidator,
} from './cpu.validators';

@Controller('products/cpus')
export class CpuController {
  constructor(private db: Database, private cpuService: CpuService) {}

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
