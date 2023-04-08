import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GpuSpecsEntity } from '@pcpartdb/database';
import { StaffGuard } from '../../auth/staff.guard';
import { Database } from '../../database';
import { Context, Ctx } from '../../shared/context';
import { validate } from '../../shared/types/validate';
import {
  autocompleteGpusRequestValidator,
  autocompleteSpecsRequestValidator,
} from './gpu-autcomplete.validators';
import { GpuAutocompleteService } from './gpu-autocomplete.service';

@Controller('gpus/autocomplete')
export class GpuAutocompleteController {
  constructor(
    private db: Database,
    private gpuAutocompleteService: GpuAutocompleteService,
  ) {}

  @Get()
  async autocomplete(@Query('query') query: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate({ query }, autocompleteGpusRequestValidator);
        return await this.gpuAutocompleteService.autocomplete(query ?? '', ctx);
      },
      { ctx },
    );
  }

  @Get('specs')
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
          key as keyof GpuSpecsEntity,
          query ?? '',
          ctx,
        );
      },
      { ctx },
    );
  }
}
