import { scrapeGpu, ScrapeGpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  CreateProductUpdateRequest,
  formatProductName,
  Game,
  getProductGame,
  getProductGameFpsValue,
  GetProductRequest,
  GPU_BENCHMARKS,
  GpuProduct,
  mergeProducts,
  productBenchmarkValue,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
  setProductBenchmark,
  setProductGameFps,
  SETTINGS_PRESETS_ORDER,
  UpdateGpuActionData,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { AutomationContext } from '../types';

export async function updateGpuAction(
  action: AutomationAction<UpdateGpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing updateGpuAction', payload);

  // Get existing GPU
  let originalGpu: GpuProduct = await getGpu(payload.gpuId, context);

  // Get sources from gpu
  const sources = originalGpu.sources;

  // Get games for scraper options to fetch FPS.
  const games = await fetchGameScraperOptions(context);

  // Scrape the GPU data from our sources.
  const { product: scrapedGpu } = await scrapeGpuData({
    sources,
    games,
  });

  // Merge and update benchmarks for existing GPU. These do not require approval.
  originalGpu = await updateBenchmarks(originalGpu, scrapedGpu, context);

  // Merge existing gpu with scraped data. Exclude auto-update disabled fields.
  const updatedGpu = mergeGpus(originalGpu, scrapedGpu);

  // Check if we have changes. Upload the update.
  if (hasUpdates(originalGpu, updatedGpu)) {
    await uploadProductUpdate(originalGpu, updatedGpu, context);
  } else {
    console.info('GPU does not have any pending updates. Not uploading.');
  }
}

async function getGpu(gpuId: number, context: AutomationContext) {
  if (gpuId == null) {
    throw new Error('Cannot update gpu, missing gpu id');
  }

  console.info(`Getting existing GPU for id=${gpuId}`);
  const gpu = await context.api.get<GpuProduct>(
    `/products/${gpuId}`,
    { retries: 2 },
    {
      params: {
        req: JSON.stringify({
          includeAutomation: true,
          includeFields: true,
          includeBenchmarks: true,
          includeGames: true,
          includeImages: true,
          includeSources: true,
          bypassCache: true,
        } as GetProductRequest),
      },
    },
  );
  if (gpu == null) {
    throw new Error(`Cannot find gpu for id=${gpuId}`);
  }
  console.info(`Fetched GPU: ${gpu.name}`);

  // Reduce necessary game data for automatic updates.
  // Just really need name and release date.
  reduceGameDataOnGpu(gpu);
  return gpu;
}

async function scrapeGpuData(options: ScrapeGpuOptions) {
  console.info('Fetching GPU data', options.sources);

  // Scrape the CPU data from our sources.
  const result = await scrapeGpu(options);
  const product = result.product as GpuProduct;
  reduceGameDataOnGpu(product);

  console.log('Finished fetching data.');
  return { product };
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

async function updateBenchmarks(
  originalGpu: GpuProduct,
  scrapedGpu: GpuProduct,
  context: AutomationContext,
) {
  console.info('Checking for updated benchmarks');
  let updated = false;

  // Combine benchmarks on both so we aren't removing benchmarks automatically.
  for (const benchmarkKey of GPU_BENCHMARKS) {
    const originalValue = productBenchmarkValue(originalGpu, benchmarkKey);
    const scrapedValue = productBenchmarkValue(scrapedGpu, benchmarkKey);

    if (
      scrapedValue != null &&
      scrapedValue > 0 &&
      originalValue !== scrapedValue
    ) {
      // Scraped has new benchmark value - update original
      setProductBenchmark(originalGpu, benchmarkKey, scrapedValue);
      updated = true;
    } else if (
      originalValue != null &&
      originalValue > 0 &&
      originalValue !== scrapedValue
    ) {
      // Scraped is missing existing benchmark value - update scraped
      setProductBenchmark(scrapedGpu, benchmarkKey, originalValue);
    }
  }
  originalGpu.benchmarks = scrapedGpu.benchmarks;

  // Combine product games on both so we aren't removing FPS data automatically
  const allProductGames = [
    ...(originalGpu?.games ?? []),
    ...(scrapedGpu?.games ?? []),
  ].sort((pg1, pg2) =>
    (pg2?.game?.releaseDate ?? '').localeCompare(pg1?.game?.releaseDate ?? ''),
  );
  const gameIdsSet = new Set<number>(allProductGames.map((pg) => pg.gameId));
  const gameIds = [...gameIdsSet.values()];
  for (const gameId of gameIds) {
    const originalPg = getProductGame(originalGpu, gameId);
    const scrapedPg = getProductGame(scrapedGpu, gameId);
    for (const preset of SETTINGS_PRESETS_ORDER) {
      const originalFps = getProductGameFpsValue(originalPg, preset);
      const scrapedFps = getProductGameFpsValue(scrapedPg, preset);

      if (scrapedFps != null && scrapedFps > 0 && originalFps !== scrapedFps) {
        // Scraped has new FPS value - update original
        setProductGameFps(originalGpu, scrapedPg, preset);
        updated = true;
      } else if (
        originalFps != null &&
        originalFps > 0 &&
        originalFps !== scrapedFps
      ) {
        // Scraped is missing existing FPS value - update scraped
        setProductGameFps(scrapedGpu, originalPg, preset);
      }
    }
  }
  originalGpu.games = scrapedGpu.games;

  if (updated) {
    console.info('Update GPU with updated benchmarks');
    await context.api.put(
      `/products/${originalGpu.id}`,
      { product: originalGpu } as UpdateProductRequest,
      { retries: 2 },
    );
    console.info('Finished updating GPU with updated benchmarks');
  }

  return originalGpu;
}

function mergeGpus(originalGpu: GpuProduct, scrapedGpu: GpuProduct) {
  const result = mergeProducts(originalGpu, scrapedGpu) as GpuProduct;

  // Reset these might have been overwritten
  result.name = originalGpu.name;
  result.slug = originalGpu.slug;
  result.company = originalGpu.company;
  result.otherNames = originalGpu.otherNames;
  result.searchText = originalGpu.searchText;
  result.affiliateUrl = originalGpu.affiliateUrl;

  result.summary = originalGpu.summary;
  result.summaryPublishedAt = originalGpu.summaryPublishedAt;
  result.summaryStale = originalGpu.summaryStale;

  if (hasSummaryImpactingChanges(originalGpu, result)) {
    result.summaryStale = true;
  }

  return result;
}

function hasSummaryImpactingChanges(before: GpuProduct, after: GpuProduct) {
  if (!after.summary) {
    return false;
  }

  return (
    before.fields?.productionStatus?.value !==
      after.fields?.productionStatus?.value ||
    before.fields?.marketSegment?.value !==
      after.fields?.marketSegment?.value ||
    before.fields?.releaseDate?.value !== after.fields?.releaseDate?.value ||
    before.fields?.msrp?.value !== after.fields?.msrp?.value ||
    before.fields?.tdp?.value !== after.fields?.tdp?.value ||
    before.fields?.memorySize?.value !== after.fields?.memorySize?.value ||
    before.fields?.memoryType?.value !== after.fields?.memoryType?.value ||
    before.fields?.suggestedPsu?.value !== after.fields?.suggestedPsu?.value ||
    before.fields?.codename?.value !== after.fields?.codename?.value ||
    before.fields?.architecture?.value !== after.fields?.architecture?.value ||
    before.fields?.slotWidth?.value !== after.fields?.slotWidth?.value ||
    before.fields?.memoryInterface?.value !==
      after.fields?.memoryInterface?.value ||
    before.fields?.memoryClock?.value !== after.fields?.memoryClock?.value ||
    before.fields?.memoryBandwidth?.value !==
      after.fields?.memoryBandwidth?.value
  );
}

function hasUpdates(before: GpuProduct, after: GpuProduct) {
  const jsonPatch = generateJsonPatch(before, after);
  return jsonPatch.length > 0;
}

async function uploadProductUpdate(
  originalGpu: GpuProduct,
  updatedGpu: GpuProduct,
  context: AutomationContext,
) {
  const productName = formatProductName(updatedGpu);
  const update: ProductUpdate = {
    productType: ProductType.Gpu,
    productId: originalGpu.id,
    productName,
    description: `Update GPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: originalGpu, updated: updatedGpu },
    metadata: {},
  };

  console.info('Uploading pending update for GPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
    { retries: 2 },
  );
  console.info('Finshed uploading pending update for GPU');
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
