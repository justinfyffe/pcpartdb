import {
  hasProductFieldValue,
  isProductField,
  Product,
  ProductType,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { createContext } from 'react';
import {
  ScrapedData,
  ScrapedDataKey,
  ScrapedDataType,
  ScrapedProduct,
} from './types';

export const ScrapeProductContext = createContext<ScrapedProduct>(null);

export function createScrapeContext(
  productType: ProductType,
  dataToScrape: ScrapedDataKey[],
  response: ScrapeProductResponse,
) {
  const { product } = response;

  const scrapedData: Record<string, ScrapedData> = {};
  Object.keys(product)
    .filter((key) => dataToScrape.includes(key as ScrapedDataKey))
    .map((key) => key as keyof Product)
    .forEach((key) => {
      const value = product[key] as ScrapedDataType;
      if (value == null) {
        return;
      }

      const enabled = isProductField(value)
        ? hasProductFieldValue(value)
        : value != null;

      scrapedData[key] = { value, enabled };
    });

  return {
    productType,
    scrapedData: scrapedData,
  } as ScrapedProduct;
}
