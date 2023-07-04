import { Module } from '@nestjs/common';
import { CpuScrapeController } from './cpu-scrape.controller';
import { CpuScrapeService } from './cpu-scrape.service';

@Module({
  imports: [],
  controllers: [CpuScrapeController],
  providers: [CpuScrapeService],
  exports: [CpuScrapeService],
})
export class CpuScrapeModule {}
