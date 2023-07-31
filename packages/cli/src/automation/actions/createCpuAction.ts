import { scrapeCpu } from '@pcpartdb/scraper';
import {
  AutomationAction,
  Cpu,
  CpuDataSource,
  CpuDataSourceKey,
  CreateCpuActionData,
  CreateProductUpdateRequest,
  generateCpuSlug,
  parseProductName,
  ProductDiff,
  productFieldValue,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { AutomationContext } from '../types';

export async function createCpuAction(
  execution: AutomationAction<CreateCpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = execution;

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
  });
  if (cpu == null) {
    // No results for scraping. Skip.
    console.error(
      `No scraped data when scraping CPU during automation for action=${execution}`,
    );
    return;
  }

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
  cpu.slug = generateCpuSlug(cpu.name, productFieldValue(cpu.company));

  // Upload update
  await uploadProductUpdate(cpu, context);
}

async function fetchCpuData(options: {
  sources: Record<string, CpuDataSource>;
}) {
  // Scrape the CPU data from our sources.
  let scrapedCpu: Cpu;
  try {
    const result = await scrapeCpu(options);
    scrapedCpu = result.product as Cpu;
    return scrapedCpu;
  } catch (e) {
    // Could not scrape the CPU. Skip as we do not have data.
    console.error('Error when scraping CPU during automation');
    console.error(e);
    return null;
  }
}

async function uploadProductUpdate(cpu: Cpu, context: AutomationContext) {
  const update: ProductUpdate<ProductDiff> = {
    productType: ProductType.Cpu,
    productName: cpu.name,
    productCompany: productFieldValue(cpu.company),
    description: `Create CPU for ${cpu.name}`,
    status: ProductUpdateStatus.Pending,
    data: { original: null, updated: cpu },
    metadata: {},
  };

  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
  );
}
