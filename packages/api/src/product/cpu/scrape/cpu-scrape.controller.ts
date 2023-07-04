import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ScrapeProductRequest } from '@pcpartdb/shared';
import { StaffGuard } from '../../../auth/staff.guard';
import { CpuScrapeService } from './cpu-scrape.service';

@Controller('products/cpus/scrape')
export class CpuScrapeController {
  constructor(private cpuScrapeService: CpuScrapeService) {}

  @Post()
  @UseGuards(StaffGuard)
  async scrape(@Body() body: ScrapeProductRequest) {
    return await this.cpuScrapeService.scrapeCpu(body);
  }
}
