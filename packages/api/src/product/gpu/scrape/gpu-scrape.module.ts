import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'packages/api/src/database';
import { GpuModule } from '../gpu.module';
import { GpuScrapeService } from './gpu-scrape.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => GpuModule)],
  controllers: [],
  providers: [GpuScrapeService],
  exports: [GpuScrapeService],
})
export class GpuScrapeModule {}
