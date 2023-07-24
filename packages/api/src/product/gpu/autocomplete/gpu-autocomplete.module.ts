import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database';
import { GpuAutocompleteRepository } from './gpu-autocomplete.repository';
import { GpuAutocompleteService } from './gpu-autocomplete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [GpuAutocompleteService, GpuAutocompleteRepository],
  exports: [GpuAutocompleteService, GpuAutocompleteRepository],
})
export class GpuAutocompleteModule {}
