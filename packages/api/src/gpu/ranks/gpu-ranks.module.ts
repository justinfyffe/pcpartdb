import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database';
import { GpuRanksRepository } from './gpu-ranks.repository';
import { GpuRanksService } from './gpu-ranks.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [GpuRanksService, GpuRanksRepository],
  exports: [GpuRanksService, GpuRanksRepository],
})
export class GpuRanksModule {}
