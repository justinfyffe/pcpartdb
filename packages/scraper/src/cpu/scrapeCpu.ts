import {
  CpuDataSource,
  CpuDataSourceKey,
  Product,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { scrapeGeekBenchCpuData } from './geekbench';
import { scrapePassMarkCpuData } from './passmark';
import { scrapeTechPowerUpCpuData } from './techpowerup';

export interface ScrapeCpuOptions {
  sources: Record<string, CpuDataSource>;
}

export async function scrapeCpu(options: ScrapeCpuOptions) {
  const { sources } = options;

  const techPowerUpUrl = sources[CpuDataSourceKey.TechPowerUp]?.url;
  const passMarkUrl = sources[CpuDataSourceKey.PassMark]?.url;
  const geekBenchUrl = sources[CpuDataSourceKey.GeekBench]?.url;

  let scrapedProduct: Partial<Product> = {};
  if (techPowerUpUrl != null) {
    const { product } = await scrapeTechPowerUpCpuData({
      url: techPowerUpUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (passMarkUrl != null) {
    const { product } = await scrapePassMarkCpuData({
      url: passMarkUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (geekBenchUrl != null) {
    const { product } = await scrapeGeekBenchCpuData({
      url: geekBenchUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }

  return { product: scrapedProduct } as ScrapeProductResponse;
}
