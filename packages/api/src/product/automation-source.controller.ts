import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApplyAutomationSourcesToProductRequest,
  AutocompleteAutomationSourcesRequest,
  ListAutomationSourcesRequest,
  UpsertAutomationSourcesRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { AutomationSourceService } from './automation-source.service';

@Controller('automation/sources')
export class AutomationSourceController {
  constructor(private db: Database, private service: AutomationSourceService) {}

  @Get('groups')
  @UseGuards(StaffGuard)
  async list(@Query('req') req: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const request: ListAutomationSourcesRequest =
          req != null ? JSON.parse(req) : null;
        return await this.service.listGroups(request, ctx);
      },
      { ctx },
    );
  }

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  async autocomplete(@Query('req') request: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const body: AutocompleteAutomationSourcesRequest =
          request != null
            ? (JSON.parse(request) as AutocompleteAutomationSourcesRequest)
            : null;

        return await this.service.autocomplete(body, ctx);
      },
      { ctx },
    );
  }

  @Post()
  @UseGuards(StaffGuard)
  async upsert(
    @Body() body: UpsertAutomationSourcesRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        await this.service.upsert(body, ctx);
      },
      { ctx },
    );
  }

  @Post('apply')
  @UseGuards(StaffGuard)
  async applyToProduct(
    @Body() body: ApplyAutomationSourcesToProductRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        await this.service.applyToProduct(body, ctx);
      },
      { ctx },
    );
  }
}
