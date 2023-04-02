import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { GpuAutocompleteModule } from './autocomplete/gpu-autocomplete.module';
import { GpuController } from './gpu.controller';
import { GpuRepository } from './gpu.repository';
import { GpuService } from './gpu.service';
import { GpuImportModule } from './import/gpu-import.module';
import { GpuRanksModule } from './ranks/gpu-ranks.module';
import { GpuRanksRepository } from './ranks/gpu-ranks.repository';

@Module({
  imports: [
    DatabaseModule,
    GpuAutocompleteModule,
    GpuImportModule,
    GpuRanksModule,
  ],
  controllers: [GpuController],
  providers: [GpuService, GpuRepository, GpuRanksRepository],
  exports: [GpuService, GpuRepository],
})
export class GpuModule {}
