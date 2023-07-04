import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database';
import { CpuRanksRepository } from './cpu-ranks.repository';
import { CpuRanksService } from './cpu-ranks.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [CpuRanksService, CpuRanksRepository],
  exports: [CpuRanksService, CpuRanksRepository],
})
export class CpuRanksModule {}
