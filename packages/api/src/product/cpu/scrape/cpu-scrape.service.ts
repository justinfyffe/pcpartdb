import { Injectable } from '@nestjs/common';
import { scrapeCpu } from '@pcpartdb/scraper';
import { ScrapeProductRequest, ScrapeProductResponse } from '@pcpartdb/shared';

@Injectable()
export class CpuScrapeService {
  constructor() {}

  async scrapeCpu(request: ScrapeProductRequest) {
    const response: ScrapeProductResponse = { product: {} };

    const scraped = await scrapeCpu({ ...request });
    response.product = scraped.product;

    return response;
  }
}
