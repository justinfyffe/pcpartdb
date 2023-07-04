import { Injectable } from '@nestjs/common';
import { scraper } from '@pcpartdb/scraper';
import { AdminOverviewViewModel, ScrapingAntUsage } from '@pcpartdb/shared';

@Injectable()
export class AdminOverviewViewModelService {
  async viewModel() {
    let scrapingAntUsage: ScrapingAntUsage;
    try {
      scrapingAntUsage = await scraper.getUsageDetails();
    } catch {
      scrapingAntUsage = null;
    }

    return {
      scrapingAntUsage,
    } as AdminOverviewViewModel;
  }
}
