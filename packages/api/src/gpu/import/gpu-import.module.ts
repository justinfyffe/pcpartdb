import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database';
import { GpuModule } from '../gpu.module';
import { GpuImportController } from './gpu-import.controller';
import { GpuImportService } from './gpu-import.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => GpuModule)],
  controllers: [GpuImportController],
  providers: [GpuImportService],
  exports: [GpuImportService],
})
export class GpuImportModule {}
