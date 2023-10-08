import {
  BenchmarKey,
  hasProductFieldValue,
  isProductField,
  ProductFieldKey,
  ProductFields,
  ProductType,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { createContext } from 'react';
import { ScrapedData, ScrapedDataType, ScrapedProduct } from './types';

export const ScrapeProductContext = createContext<ScrapedProduct>(null);

export function createScrapeContext(
  productType: ProductType,
  fieldsToScrape: ProductFieldKey[],
  benchmarksToScrape: BenchmarKey[],
  response: ScrapeProductResponse,
) {
  const { product } = response;

  const fields: Record<string, ScrapedData> = {};
  Object.keys(product?.fields)
    .filter((key) => fieldsToScrape.includes(key as ProductFieldKey))
    .map((key) => key as keyof ProductFields)
    .forEach((key) => {
      const value = product.fields[key] as ScrapedDataType;
      if (value == null) {
        return;
      }

      const enabled = isProductField(value)
        ? hasProductFieldValue(value)
        : value != null;

      fields[key] = { value, enabled };
    });

  const benchmarks: Record<string, ScrapedData> = {};
  product?.benchmarks
    ?.filter((benchmark) => benchmarksToScrape.includes(benchmark.benchmarkKey))
    .forEach((benchmark) => {
      const value = benchmark;
      const enabled = !!benchmark.value;
      benchmarks[benchmark.benchmarkKey] = { value, enabled };
    });

  return {
    productType,
    data: {
      name: { value: product?.name, enabled: !!product?.name },
      searchText: {
        value: product?.searchText,
        enabled: !!product?.searchText,
      },
      otherNames: {
        value: product?.otherNames,
        enabled: !!product?.otherNames,
      },
      company: { value: product?.company, enabled: !!product?.company },
      fields,
      benchmarks,
    },
  } as ScrapedProduct;
}
