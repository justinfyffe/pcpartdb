import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database';
import { GpuAutocompleteController } from './gpu-autocomplete.controller';
import { GpuAutocompleteRepository } from './gpu-autocomplete.repository';
import { GpuAutocompleteService } from './gpu-autocomplete.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GpuAutocompleteController],
  providers: [GpuAutocompleteService, GpuAutocompleteRepository],
  exports: [GpuAutocompleteService, GpuAutocompleteRepository],
})
export class GpuAutocompleteModule {}
