import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { GpuController } from './gpu.controller';
import { GpuRepository } from './gpu.repository';
import { GpuService } from './gpu.service';
import { GpuImporterService } from './gpu-importer.service';

@Module({
  imports: [SharedModule],
  controllers: [GpuController],
  providers: [GpuService, GpuImporterService, GpuRepository],
  exports: [GpuService, GpuImporterService, GpuRepository],
})
export class GpuModule {}
