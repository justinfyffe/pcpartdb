import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database';
import { CpuAutocompleteController } from './cpu-autocomplete.controller';
import { CpuAutocompleteRepository } from './cpu-autocomplete.repository';
import { CpuAutocompleteService } from './cpu-autocomplete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CpuAutocompleteController],
  providers: [CpuAutocompleteService, CpuAutocompleteRepository],
  exports: [CpuAutocompleteService, CpuAutocompleteRepository],
})
export class CpuAutocompleteModule {}
