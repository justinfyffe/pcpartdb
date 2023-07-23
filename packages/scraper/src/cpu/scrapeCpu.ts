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

  const techPowerUp = sources[CpuDataSourceKey.TechPowerUp];
  const passMark = sources[CpuDataSourceKey.PassMark];
  const geekBench = sources[CpuDataSourceKey.GeekBench];

  let scrapedProduct: Partial<Product> = { meta: { dataSources: {} } };
  if (techPowerUp?.url != null) {
    const { product } = await scrapeTechPowerUpCpuData({
      url: techPowerUp.url,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[CpuDataSourceKey.TechPowerUp] = techPowerUp;
  }
  if (passMark?.url != null) {
    const { product } = await scrapePassMarkCpuData({ url: passMark.url });
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[CpuDataSourceKey.PassMark] = passMark;
  }
  if (geekBench?.url != null) {
    const { product } = await scrapeGeekBenchCpuData({ url: geekBench.url });
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[CpuDataSourceKey.GeekBench] = geekBench;
  }

  return { product: scrapedProduct } as ScrapeProductResponse;
}
