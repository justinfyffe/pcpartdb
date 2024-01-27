import { scrapeCpu, ScrapeCpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  CpuProduct,
  CreateCpuActionData,
  CreateProductUpdateRequest,
  formatProductName,
  generateProductOtherNames,
  generateProductSlug,
  parseProductName,
  ProductSource,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { AutomationContext } from '../types';

export async function createCpuAction(
  action: AutomationAction<CreateCpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing createCpuAction', payload);

  // Get sources from cpu or action
  const sources: ProductSource[] = payload.sources.map((source) => ({
    sourceKey: source.sourceKey,
    sourceUrl: source.sourceUrl,
  }));

  // Scrape the CPU data from our sources.
  const cpu = await fetchCpuData({ sources });
  cpu.sources = sources;

  // New CPUs have some additional data to be applied
  // Preferred name from source
  if (payload?.preferredName) {
    const { company, name } = parseProductName(payload.preferredName);
    cpu.name = name;
    if (company != null) {
      if (company.toLowerCase() !== cpu.company?.toLowerCase()) {
        cpu.company = company;
      }
    }

    cpu.otherNames = generateProductOtherNames({ company, name });
    cpu.searchText = formatProductName(cpu);
  }

  // Generate slug, new CPU didn't have it yet.
  cpu.slug =
    payload?.preferredSlug ||
    generateProductSlug({ name: cpu.name, company: cpu.company });

  // Upload update
  await uploadProductUpdate(cpu, context);
}

async function fetchCpuData(options: ScrapeCpuOptions) {
  console.info('Fetching CPU data', options.sources);

  // Scrape the CPU data from our sources.
  const result = await scrapeCpu(options);
  const scrapedCpu = result.product as CpuProduct;

  console.log('Finished fetching data.');
  return scrapedCpu;
}

async function uploadProductUpdate(
  cpu: CpuProduct,
  context: AutomationContext,
) {
  const productName = formatProductName(cpu);
  const update: ProductUpdate = {
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
