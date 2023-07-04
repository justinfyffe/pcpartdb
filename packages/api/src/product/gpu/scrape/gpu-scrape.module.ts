import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'packages/api/src/database';
import { GpuModule } from '../gpu.module';
import { GpuScrapeController } from './gpu-scrape.controller';
import { GpuScrapeService } from './gpu-scrape.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => GpuModule)],
  controllers: [GpuScrapeController],
  providers: [GpuScrapeService],
  exports: [GpuScrapeService],
})
export class GpuScrapeModule {}
