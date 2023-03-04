import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { GpuController } from './gpu.controller';
import { GpuRepository } from './gpu.repository';
import { GpuService } from './gpu.service';
import { GpuImporterService } from './gpu-importer.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GpuController],
  providers: [GpuService, GpuImporterService, GpuRepository],
  exports: [GpuService, GpuImporterService, GpuRepository],
})
export class GpuModule {}
