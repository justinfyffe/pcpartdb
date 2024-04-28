import { scrapeGpu, ScrapeGpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  CreateGpuActionData,
  CreateProductUpdateRequest,
  formatProductName,
  Game,
  generateProductOtherNames,
  generateProductSlug,
  GpuProduct,
  parseProductName,
  ProductSource,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { AutomationContext } from '../types';

export async function createGpuAction(
  action: AutomationAction<CreateGpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing createGpuAction', payload);

  // Get sources from gpu or action
  const sources: ProductSource[] = payload.sources.map((source) => ({
    sourceKey: source.sourceKey,
    sourceUrl: source.sourceUrl,
  }));

  // Get games for scraper options to fetch FPS.
  const games = await fetchGameScraperOptions(context);

  // Scrape the GPU data from our sources.
  const gpu = await scrapeGpuData({
    sources,
    games,
  });
  gpu.sources = sources;

  // New GPUs have some additional data to be applied
  // Preferred name from source data.
  if (payload?.preferredName) {
    const { company, name } = parseProductName(payload.preferredName);
    gpu.name = name;
    if (company != null) {
      if (company.toLowerCase() !== gpu.company?.toLowerCase()) {
        gpu.company = company;
      }
    }
    gpu.otherNames = generateProductOtherNames({ company, name });
    gpu.searchText = formatProductName(gpu);
  }

  // Generate slug, new GPU doesn't have one yet.
  gpu.slug =
    payload?.preferredSlug ||
    generateProductSlug({ name: gpu.name, company: gpu.company });

  // Upload update
  await uploadProductUpdate(gpu, context);
}

async function scrapeGpuData(options: ScrapeGpuOptions) {
  console.info('Fetching GPU data', options.sources);

  // Scrape the GPU data from our sources.
  const result = await scrapeGpu(options);
  const product = result.product as GpuProduct;
  reduceGameDataOnGpu(product);

  console.log('Finished fetching data.');
  return product;
}

async function fetchGameScraperOptions(context: AutomationContext) {
  console.info('Fetching Game Scraper Options');

  const result = await context.api.get<Partial<Game>[]>(
    '/games/scraper-options',
    { retries: 2 },
  );

  console.info('Finished Game Scraper Options');
  return result;
}

async function uploadProductUpdate(
  gpu: GpuProduct,
  context: AutomationContext,
) {
  const productName = formatProductName(gpu);
  const update: ProductUpdate = {
    productType: ProductType.Gpu,
    productName,
    description: `Create GPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: null, updated: gpu },
    metadata: {},
  };

  console.info('Uploading pending creation for GPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
    { retries: 2 },
  );
  console.info('Finshed uploading pending creation for GPU');
}

function reduceGameDataOnGpu(gpu: GpuProduct) {
  gpu?.games?.forEach((pg) => {
    pg.game = reduceGameData(pg.game);
  });
}

function reduceGameData(game: Partial<Game>) {
  return game != null
    ? {
        name: game.name,
        releaseDate: game.releaseDate,
        slug: game.slug,
      }
    : null;
}
