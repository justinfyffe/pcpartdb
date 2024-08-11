import { ScrapingAntUsage } from '@pcpartdb/shared';
import axios from 'axios';

enum ScraperType {
  ScrapingAnt = 'SCRAPING_ANT',
  ScrapingFish = 'SCRAPING_FISH',
}

interface ScraperOptions {
  type: ScraperType;
  scrapingAntApiKey?: string;
  scrapingFishApiKey?: string;
}

interface ScrapeOptions {
  retries?: number;
  noProxy?: boolean;

  browser?: boolean;
  returnPageSource?: boolean;
  jsonExtended?: boolean;
}

export class Scraper {
  private type?: ScraperType;
  private scrapingAntApiKey?: string;
  private scrapingFishApiKey?: string;

  constructor(options: ScraperOptions) {
    this.type = options?.type;
    this.scrapingAntApiKey = options?.scrapingAntApiKey;
    this.scrapingFishApiKey = options?.scrapingFishApiKey;
  }

  getScrapingUrl(url: string, options?: ScrapeOptions) {
    if (this.type === ScraperType.ScrapingAnt) {
      return this.getScrapingAntUrl(url, options);
    } else if (this.type === ScraperType.ScrapingFish) {
      return this.getScrapingFishUrl(url, options);
    }
    return null;
  }

  getScrapingAntUrl(url: string, options?: ScrapeOptions) {
    const params = new URLSearchParams();
    params.set('url', url);
    params.set('browser', options?.browser ? 'true' : 'false');
    params.set('proxy_country', 'US');
    params.set('x-api-key', this.scrapingAntApiKey);
    if (options?.returnPageSource) {
      params.set(
        'return_page_source',
        options?.returnPageSource ? 'true' : 'false',
      );
    }

    return options?.jsonExtended
      ? `https://api.scrapingant.com/v2/extended?${params.toString()}`
      : `https://api.scrapingant.com/v2/general?${params.toString()}`;
  }

  getScrapingFishUrl(url: string, options?: ScrapeOptions) {
    const params = new URLSearchParams();
    params.set('url', url);
    params.set('api_key', this.scrapingFishApiKey);

    return `https://scraping.narf.ai/api/v1/?${params.toString()}`;
  }

  async scrapeGet<T = any>(url: string, options?: ScrapeOptions) {
    const proxiedUrl =
      options?.noProxy === true ? url : this.getScrapingUrl(url, options);

    console.log(`SCRAPE GET: ${proxiedUrl}`);

    let response = null;
    const retries = options?.retries ?? 0;
    for (let i = 0; i <= retries; ++i) {
      try {
        response = await axios.get<T>(proxiedUrl);
        break;
      } catch (err) {
        console.error(err);
        if (i < retries) {
          console.error(`Encountered error scraping ${url}. Retrying`);
        } else {
          throw err;
        }
      }
    }

    return response;
  }

  async scrapePost<
    TRequest extends Record<string, string | number | boolean>,
    TResponse = any,
  >(
    url: string,
    data: TRequest,
    options?: ScrapeOptions & { formData?: boolean },
  ) {
    const proxiedUrl =
      options?.noProxy === true ? url : this.getScrapingUrl(url);

    console.log(`SCRAPE POST: ${proxiedUrl}`);

    const isFormData = options?.formData ?? false;
    const body = isFormData
      ? Object.keys(data).reduce(
          (path, key) => path + `&${key}=${encodeURIComponent(data[key])}`,
          '',
        )
      : data;

    let response = null;
    const retries = options?.retries ?? 0;
    for (let i = 0; i <= retries; ++i) {
      try {
        response = await axios.post<TResponse>(proxiedUrl, body, {
          headers: {
            'Content-Type': isFormData
              ? 'multipart/form-data'
              : 'application/json',
          },
        });
        break;
      } catch (err) {
        console.error(err);
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
    } as ScrapingAntUsage;
  }
}

export const scraper = new Scraper({
  type: process.env.SCRAPER_TYPE as ScraperType,
  scrapingAntApiKey: process.env.SCRAPING_ANT_API_KEY,
  scrapingFishApiKey: process.env.SCRAPING_FISH_API_KEY,
});
