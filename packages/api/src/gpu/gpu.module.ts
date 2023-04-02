import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { GpuController } from './gpu.controller';
import { GpuRepository } from './gpu.repository';
import { GpuService } from './gpu.service';
import { GpuAutocompleteRepository } from './gpu-autocomplete.repository';
import { GpuImporterService } from './gpu-importer.service';
import { GpuRanksRepository } from './gpu-ranks.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [GpuController],
  providers: [
    GpuService,
    GpuImporterService,
    GpuRepository,
    GpuAutocompleteRepository,
    GpuRanksRepository,
  ],
  exports: [GpuService, GpuImporterService, GpuRepository],
})
export class GpuModule {}
