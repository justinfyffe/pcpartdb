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
  AutocompleteGamesRequest,
  CreateGameRequest,
  ListGamesRequest,
  ScrapeGamesRequest,
  UpdateGameRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private db: Database, private service: GameService) {}

  @Get()
  async list(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const req: ListGamesRequest = JSON.parse(reqJson);

    return await this.service.list(req, { includeListingImage: true }, ctx);
  }

  @Get('autocomplete')
  async autocomplete(@Query('req') reqJson: string, @Ctx() ctx: Context) {
    const req: AutocompleteGamesRequest = JSON.parse(reqJson);
    return await this.service.autocomplete(
      req,
      { includeListingImage: true },
      ctx,
    );
  }

  @Get('scraper-options')
  async getScraperOptions(@Ctx() ctx: Context) {
    return await this.service.getScraperOptions(ctx);
  }

  @Post('scrape')
  @UseGuards(StaffGuard)
  async scrape(@Body() request: ScrapeGamesRequest, @Ctx() ctx: Context) {
    return await this.service.scrape(request, ctx);
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(@Body() req: CreateGameRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        return await this.service.create(req, ctx);
      },
      { ctx },
    );
  }

  @Put(':id')
  @UseGuards(StaffGuard)
  async update(
    @Param('id') idStr: string,
    @Body() req: UpdateGameRequest,
    @Ctx() ctx: Context,
  ) {
    const id = Number(idStr);
    return await this.db.transaction(
      async () => {
        return await this.service.update(id, req, ctx);
      },
      { ctx },
    );
  }

  @Delete(':id')
  @UseGuards(StaffGuard)
  async delete(@Param('id') idStr: string, @Ctx() ctx: Context) {
    const id = Number(idStr);
    return await this.db.transaction(
      async () => {
        return await this.service.delete(id, ctx);
      },
      { ctx },
    );
  }
}
