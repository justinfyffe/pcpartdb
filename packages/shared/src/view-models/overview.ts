import { ApiKey } from '../auth';
import { ScrapingAntUsage } from '../scraper';

export interface AdminOverviewViewModel {
  apiKey?: ApiKey;
  cacheItems: number;
  scrapingAntUsage: ScrapingAntUsage;
}
