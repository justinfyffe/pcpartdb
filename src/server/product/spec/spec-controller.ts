import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StaffGuard } from '@server/auth/staff-guard';
import { transaction } from '@server/db/database';
import type { SpecKey } from '@shared/spec';
import { SpecService } from './spec-service';

@Controller('products/specs')
export class SpecController {
  constructor(private service: SpecService) {}

  @Get('autocomplete')
  @UseGuards(StaffGuard)
  async autocomplete(
    @Query('key') key: SpecKey,
    @Query('value') value: string,
  ) {
    return await transaction((trx) =>
      this.service.autocomplete(key, value ?? '', { trx }),
    );
  }
}
