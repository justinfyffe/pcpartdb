import axios from 'axios';

export interface ScraperUsage {
  startDate: Date;
  endDate: Date;
  totalCredits: number;
  remainingCredits: number;
}

interface ScraperOptions {
  scrapingAntApiKey: string;
}

interface ScrapeOptions {
  retries?: number;
  noProxy?: boolean;
}

export class Scraper {
  private scrapingAntApiKey: string;

  constructor(options: ScraperOptions) {
    this.scrapingAntApiKey = options?.scrapingAntApiKey;
  }

  getScrapingUrl(url: string) {
    const params = new URLSearchParams();
    params.set('url', url);
    params.set('browser', 'false');
    params.set('proxy_country', 'US');
    params.set('x-api-key', this.scrapingAntApiKey);

    return `https://api.scrapingant.com/v2/general?${params.toString()}`;
  }

  async scrape<T = any>(url: string, options?: ScrapeOptions) {
    const proxiedUrl =
      options?.noProxy === true ? url : this.getScrapingUrl(url);

    let response = null;
    const retries = options?.retries ?? 0;
    for (let i = 0; i <= retries; ++i) {
      try {
        response = await axios.get<T>(proxiedUrl);
        break;
      } catch (err) {
        if (i < retries) {
          console.error(`Encountered error scraping ${url}. Retrying`);
        } else {
          throw err;
        }
      }
    }

    return response;
  }

  async getUsageDetails() {
    const response = await axios.get(
      `https://api.scrapingant.com/v2/usage?x-api-key=${this.scrapingAntApiKey}`,
    );

    const data = response.data;

    return {
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      totalCredits: data.plan_total_credits,
      remainingCredits: data.remained_credits,
    } as ScraperUsage;
  }
}

export const scraper = new Scraper({
  scrapingAntApiKey: process.env.SCRAPING_ANT_API_KEY,
});
