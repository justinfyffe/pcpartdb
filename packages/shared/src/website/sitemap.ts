import { MarketSegment } from '../product';

export interface SitemapEntry {
  url?: string;
  lastModification?: number;
}

export interface SitemapProductSlug {
  productId?: number;
  slug?: string;
  releaseDate?: string;
  lastModification?: number;
  hasBenchmarks?: boolean;
  marketSegment?: MarketSegment;
}
