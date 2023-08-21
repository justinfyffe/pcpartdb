import { scrapeCpu, ScrapeCpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  Cpu,
  CpuDataSourceKey,
  CpuUpdate,
  CreateCpuActionData,
  CreateProductUpdateRequest,
  generateCpuSlug,
  parseProductName,
  productFieldValue,
  ProductType,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { AutomationContext } from '../types';

const DEFAULT_DELAY = 30_000;

export async function createCpuAction(
  action: AutomationAction<CreateCpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing createCpuAction', payload);

  // Get sources from cpu or action
  const sources = payload.sources;
  const techPowerUpSource = {
    url: sources?.filter(
      (source) => source.sourceKey === CpuDataSourceKey.TechPowerUp,
    )[0]?.sourceUrl,
  };
  const passMarkSource = {
    url: sources?.filter(
      (source) => source.sourceKey === CpuDataSourceKey.PassMark,
    )[0]?.sourceUrl,
  };
  const geekBenchSource = {
    url: sources?.filter(
      (source) => source.sourceKey === CpuDataSourceKey.GeekBench,
    )[0]?.sourceUrl,
  };

  // Scrape the CPU data from our sources.
  const cpu = await fetchCpuData({
    sources: {
      [CpuDataSourceKey.TechPowerUp]: techPowerUpSource,
      [CpuDataSourceKey.PassMark]: passMarkSource,
      [CpuDataSourceKey.GeekBench]: geekBenchSource,
    },
    concurrency: context.concurrency ? 3 : 1,
    delayBetweenChunksMs: context.requestChunkDelay || DEFAULT_DELAY,
  });

  // New CPUs have some additional data to be applied
  // Preferred name from source
  if (payload?.preferredName) {
    const { company, name } = parseProductName(payload.preferredName);
    cpu.name = name;
    if (company != null) {
      if (
        company.toLowerCase() !==
        productFieldValue<string>(cpu.company)?.toLowerCase()
      ) {
        cpu.company = {
          value: company,
          meta: { fieldKey: 'company', autoUpdate: false },
        };
      }
    }
  }

  // Generate slug, new CPU didn't have it yet.
  cpu.slug =
    payload?.preferredSlug ||
    generateCpuSlug(cpu.name, productFieldValue(cpu.company));

  // Upload update
  await uploadProductUpdate(cpu, context);
}

async function fetchCpuData(options: ScrapeCpuOptions) {
  console.info('Fetching CPU data', options.sources);

  // Scrape the CPU data from our sources.
  const result = await scrapeCpu(options);
  const scrapedCpu = result.product as Cpu;

  console.log('Finished fetching data.');
  return scrapedCpu;
}

async function uploadProductUpdate(cpu: Cpu, context: AutomationContext) {
  const productName = `${productFieldValue(cpu.company) || ''} ${
    cpu.name
  }`.trim();
  const update: CpuUpdate = {
    productType: ProductType.Cpu,
    productName,
    description: `Create CPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: null, updated: cpu },
    metadata: {},
  };

  console.info('Uploading pending creation for CPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
    { retries: 2 },
  );
  console.info('Finshed uploading pending creation for CPU');
}
