import { ProductField } from '@pcpartdb/shared';

export interface ScraperContext {
  memoizedFields?: Record<string, ProductField>;
}

export interface CommonScraperOptions {
  noProxy?: boolean;
  ctx?: ScraperContext;
}
