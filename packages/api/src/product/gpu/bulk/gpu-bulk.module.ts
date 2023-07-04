import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database';
import { GpuModule } from '../gpu.module';
import { GpuBulkController } from './gpu-bulk.controller';
import { GpuBulkService } from './gpu-bulk.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => GpuModule)],
  controllers: [GpuBulkController],
  providers: [GpuBulkService],
  exports: [GpuBulkService],
})
export class GpuBulkModule {}
