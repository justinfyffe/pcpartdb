import { Module } from '@nestjs/common';
import { CpuScrapeService } from './cpu-scrape.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CpuScrapeService],
  exports: [CpuScrapeService],
})
export class CpuScrapeModule {}
