import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database';
import { CpuModule } from '../cpu.module';
import { CpuBulkController } from './cpu-bulk.controller';
import { CpuBulkService } from './cpu-bulk.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => CpuModule)],
  controllers: [CpuBulkController],
  providers: [CpuBulkService],
  exports: [CpuBulkService],
})
export class CpuBulkModule {}
