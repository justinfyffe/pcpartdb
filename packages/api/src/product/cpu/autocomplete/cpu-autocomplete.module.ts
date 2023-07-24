import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database';
import { CpuAutocompleteRepository } from './cpu-autocomplete.repository';
import { CpuAutocompleteService } from './cpu-autocomplete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [CpuAutocompleteService, CpuAutocompleteRepository],
  exports: [CpuAutocompleteService, CpuAutocompleteRepository],
})
export class CpuAutocompleteModule {}
