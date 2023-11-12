import { Injectable } from '@nestjs/common';
import { scraper } from '@pcpartdb/scraper';
import { AdminOverviewViewModel, ScrapingAntUsage } from '@pcpartdb/shared';
import { ApiKeyService } from 'packages/api/src/auth/api-key.service';
import { CacheService } from 'packages/api/src/shared/cache/cache.service';
import { Context } from 'packages/api/src/shared/context';

@Injectable()
export class AdminOverviewViewModelService {
  constructor(
    private apiKeyService: ApiKeyService,
    private cacheService: CacheService,
  ) {}

  async viewModel(ctx: Context) {
    const apiKey = await this.apiKeyService.findForCurrentUser(ctx);

    const cacheSize = this.cacheService.totalSize();
    const cacheItems = this.cacheService.totalItems();

    let scrapingAntUsage: ScrapingAntUsage;
    try {
      scrapingAntUsage = await scraper.getUsageDetails();
    } catch {
      scrapingAntUsage = null;
    }

    return {
      apiKey,
      cacheSize,
      cacheItems,
      scrapingAntUsage,
    } as AdminOverviewViewModel;
  }
}
