import { ApiKey } from '../auth';
import { ScrapingAntUsage } from '../scraper';

export interface AdminOverviewViewModel {
  apiKey?: ApiKey;
  scrapingAntUsage: ScrapingAntUsage;
}
