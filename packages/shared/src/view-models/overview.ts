import { ApiKey } from '../auth';
import { ScrapingAntUsage } from '../scraper';

export interface AdminOverviewViewModel {
  apiKey?: ApiKey;
  cacheSize: number;
  cacheItems: number;
  scrapingAntUsage: ScrapingAntUsage;
}
