import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CpuEntity } from '@pcpartdb/database';
import { StaffGuard } from '../../../auth/staff.guard';
import { Database } from '../../../database';
import { Context, Ctx } from '../../../shared/context';
import { validate } from '../../../shared/types/validate';
import {
  autocompleteCpuDataRequestValidator,
  autocompleteCpusRequestValidator,
} from './cpu-autcomplete.validators';
import { CpuAutocompleteService } from './cpu-autocomplete.service';

@Controller('products/cpus/autocomplete')
export class CpuAutocompleteController {
  constructor(
    private db: Database,
    private cpuAutocompleteService: CpuAutocompleteService,
  ) {}

  @Get()
  async autocomplete(@Query('query') query: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate({ query }, autocompleteCpusRequestValidator);
        return await this.cpuAutocompleteService.autocomplete(query ?? '', ctx);
      },
      { ctx },
    );
  }

  @Get('field')
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
}
