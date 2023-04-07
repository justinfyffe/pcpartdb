import { Injectable } from '@nestjs/common';
import { scraper } from '@pcpartdb/scraper';
import { AdminOverviewViewModel } from '@pcpartdb/shared';

@Injectable()
export class AdminOverviewViewModelService {
  async viewModel() {
    return {
      scrapingAntUsage: await scraper.getUsageDetails(),
    } as AdminOverviewViewModel;
  }
}
