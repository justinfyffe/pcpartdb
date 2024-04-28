import { ProductType } from '../product';
import { SitemapProductSlug } from './sitemap';

/**
 * Request object to upload sitemap file.
 */
export interface UploadSitemapRequest {
  // Added by interceptor. Don't populate manually.
  originalFileName?: string;
  tempPath?: string;
}

/**
 * Request object to fetch product slugs for a specific product type
 */
export interface GetSitemapProductSlugsRequest {
  productType: ProductType;
}

/**
 * Response object for fetching product slugs of a specific product type.
 */
export interface GetSitemapProductSlugsResponse {
  slugs: SitemapProductSlug[];
}
