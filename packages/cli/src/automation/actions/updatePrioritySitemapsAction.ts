import {
  AutomationAction,
  concurrent,
  ConcurrentFn,
  getAboutPath,
  getCompareCpusPath,
  getCompareGpusPath,
  getListCpusPath,
  getListGpusPath,
  getPrivacyPath,
  GetSitemapProductSlugsRequest,
  GetSitemapProductSlugsResponse,
  getViewCpuPath,
  getViewGpuPath,
  LIST_CPUS_PRESETS,
  LIST_GPUS_PRESETS,
  MarketSegment,
  ProductType,
  SitemapProductSlug,
  WEBSITE_URL,
} from '@pcpartdb/shared';
import { parse } from 'date-fns';
import FormData from 'form-data';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as uuid from 'uuid';
import xml from 'xml';
import * as zlib from 'zlib';
import { AutomationContext } from '../types';
import { prioritySitemapPath, sitemapUrl, websiteUrl } from '../utils/sitemap';

const DELAY_BETWEEN_UPLOAD = 4_000;
const FILES_PER_UPLOAD = 15;

const INDEX_FILENAME = 'priority-sitemap-index.xml';
const GENERAL_FILENAME = 'priority-sitemap-general.xml';
const CPU_LISTS_FILENAME = 'priority-sitemap-cpu-lists.xml';
const CPU_PRODUCTS_FILENAME = 'priority-sitemap-cpu-products-{i}.xml';
const CPU_COMPARISONS_FILENAME = 'priority-sitemap-cpu-comparisons-{i}.xml';
const GPU_LISTS_FILENAME = 'priority-sitemap-gpu-lists.xml';
const GPU_CHIPSETS_FILENAME = 'priority-sitemap-gpu-chipsets-{i}.xml';
const GPU_COMPARISONS_FILENAME = 'priority-sitemap-gpu-comparisons-{i}.xml';

interface SitemapIndexEntry {
  url: string;
}

interface SitemapEntry {
  url: string;
}

export async function updatePrioritySitemapsAction(
  action: AutomationAction,
  context: AutomationContext,
) {
  // Fetch cpu slugs
  const cpuSlugs = await fetchProductSlugs(
    { productType: ProductType.Cpu },
    context,
  );

  // Fetch gpu chipset slugs
  const gpuChipsetSlugs = await fetchProductSlugs(
    { productType: ProductType.Gpu },
    context,
  );

  // Construct sitemaps
  await removeExistingSitemaps();
  const sitemapIndexEntries = [
    await writeGeneralSitemap(),
    await writeCpuListsSitemap(),
    await writeGpuListsSitemap(),
    ...(await writeCpusSitemap(cpuSlugs)),
    ...(await writeCpuComparisonsSitemap(cpuSlugs)),
    ...(await writeGpuChipsetsSitemap(gpuChipsetSlugs)),
    ...(await writeGpuComparisonsSitemap(gpuChipsetSlugs)),
  ];
  await writeSitemapIndex(sitemapIndexEntries);

  // Upload sitemap files
  await uploadSitemaps(context);

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updatePrioritySitemapsDate: new Date().getTime(),
  };
}

// General Sitemap

async function writeGeneralSitemap() {
  console.log('Generating General sitemap');

  const entries = [
    { url: WEBSITE_URL },
    { url: websiteUrl(getAboutPath()) },
    { url: websiteUrl(getPrivacyPath()) },
  ] as SitemapEntry[];

  await writeSitemap(prioritySitemapPath(GENERAL_FILENAME), entries);
  console.log(`Generated ${GENERAL_FILENAME} with ${entries.length} entries`);

  return { url: sitemapUrl(GENERAL_FILENAME, { compressed: true }) };
}

// CPU Sitemaps

async function writeCpuListsSitemap() {
  console.log('Generating CPU Lists sitemap');

  const entries: SitemapEntry[] = Object.entries(LIST_CPUS_PRESETS).map(
    ([_key, preset]) => ({
      url: websiteUrl(getListCpusPath(preset)),
    }),
  );

  await writeSitemap(prioritySitemapPath(CPU_LISTS_FILENAME), entries);
  console.log(`Generated ${CPU_LISTS_FILENAME} with ${entries.length} entries`);

  return { url: sitemapUrl(CPU_LISTS_FILENAME, { compressed: true }) };
}

async function writeCpusSitemap(cpuSlugs: SitemapProductSlug[]) {
  console.log('Generating CPUs sitemap');

  let totalEntries = 0;
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};

  for (let i = 0; i < cpuSlugs.length - 1; ++i) {
    const cpuSlug = cpuSlugs[i];

    const url = websiteUrl(getViewCpuPath({ slug: cpuSlug.slug }));
    const name = getSitemapName(url, 0);
    if (!entries[name]) {
      entries[name] = [];
    }

    entries[name].push({ url });
    ++totalEntries;
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = CPU_PRODUCTS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(prioritySitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({ url });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for CPUs sitemaps`);

  return sitemapIndexEntries;
}

async function writeCpuComparisonsSitemap(cpuSlugs: SitemapProductSlug[]) {
  console.log('Generating CPU Comparison sitemap');
  let totalEntries = 0;
  let skippedBecauseReleaseDate = 0;
  let skippedBecauseBenchmarks = 0;
  let skippedBecauseMarketSegments = 0;
  let skippedBecauseTimeDelta = 0;
  const MAX_YEARS_DIFFERENCE = 1000 * 60 * 60 * 24 * 365 * 4; // 4 Years

  const urls: string[] = [];
  for (let i = 0; i < cpuSlugs.length - 1; ++i) {
    for (let j = i + 1; j < cpuSlugs.length; ++j) {
      const cpuSlug1 = cpuSlugs[i];
      const cpuSlug2 = cpuSlugs[j];

      // Skip urls where a CPU has not released
      if (!hasReleaseDates(cpuSlug1, cpuSlug2)) {
        skippedBecauseReleaseDate++;
        continue;
      }

      // Skip urls where a CPU is missing benchmarks
      if (!hasBenchmarks(cpuSlug1, cpuSlug2)) {
        skippedBecauseBenchmarks++;
        continue;
      }

      // Skip urls where it doesn't make sense to compare market segments
      if (!hasSimilarMarketSegments(cpuSlug1, cpuSlug2)) {
        skippedBecauseMarketSegments++;
        continue;
      }

      // Skip urls where they released in significantly different times
      if (!isWithinTimeDelta(cpuSlug1, cpuSlug2, MAX_YEARS_DIFFERENCE)) {
        skippedBecauseTimeDelta++;
        continue;
      }

      const url = websiteUrl(
        getCompareCpusPath({
          productType: ProductType.Cpu,
          comparison: [
            { id: cpuSlug1.productId, slug: cpuSlug1.slug },
            { id: cpuSlug2.productId, slug: cpuSlug2.slug },
          ],
          ordered: true,
        }),
      );

      urls.push(url);
      totalEntries += 1;
    }
  }

  const hashSize = getComparisonHashSize(urls.length);
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};
  for (const url of urls) {
    const sitemapName = getSitemapName(url, hashSize);

    if (!entries[sitemapName]) {
      entries[sitemapName] = [];
    }

    entries[sitemapName].push({ url });
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = CPU_COMPARISONS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(prioritySitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({ url });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for CPU Comparison sitemaps`);
  console.log(
    `${skippedBecauseReleaseDate} skipped because of missing release date.`,
  );
  console.log(
    `${skippedBecauseBenchmarks} skipped because of missing benchmarks.`,
  );
  console.log(
    `${skippedBecauseMarketSegments} skipped because of non-similar market segments.`,
  );
  console.log(
    `${skippedBecauseTimeDelta} skipped because of release date delta.`,
  );

  return sitemapIndexEntries;
}

// GPU Sitemaps

async function writeGpuListsSitemap() {
  console.log('Generating GPU Lists sitemap');

  const entries: SitemapEntry[] = Object.entries(LIST_GPUS_PRESETS).map(
    ([_key, preset]) => ({
      url: websiteUrl(getListGpusPath(preset)),
    }),
  );

  await writeSitemap(prioritySitemapPath(GPU_LISTS_FILENAME), entries);
  console.log(`Generated ${GPU_LISTS_FILENAME} with ${entries.length} entries`);

  return { url: sitemapUrl(GPU_LISTS_FILENAME, { compressed: true }) };
}

async function writeGpuChipsetsSitemap(gpuSlugs: SitemapProductSlug[]) {
  console.log('Generating GPU Chipsets sitemap');

  let totalEntries = 0;
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    const gpuSlug = gpuSlugs[i];

    const url = websiteUrl(getViewGpuPath({ slug: gpuSlug.slug }));

    const name = getSitemapName(url, 0);
    if (!entries[name]) {
      entries[name] = [];
    }

    entries[name].push({ url });
    ++totalEntries;
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = GPU_CHIPSETS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(prioritySitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({ url });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU chipsets sitemaps`);

  return sitemapIndexEntries;
}

async function writeGpuComparisonsSitemap(gpuSlugs: SitemapProductSlug[]) {
  console.log('Generating GPU Comparison sitemap');

  let totalEntries = 0;
  let skippedBecauseReleaseDate = 0;
  let skippedBecauseBenchmarks = 0;
  let skippedBecauseMarketSegments = 0;
  let skippedBecauseTimeDelta = 0;
  const MAX_YEARS_DIFFERENCE = 1000 * 60 * 60 * 24 * 365 * 4; // 4 Years

  const urls: string[] = [];

  for (let i = 0; i < gpuSlugs.length - 1; ++i) {
    for (let j = i + 1; j < gpuSlugs.length; ++j) {
      const gpuSlug1 = gpuSlugs[i];
      const gpuSlug2 = gpuSlugs[j];

      // Skip urls where a CPU has not released
      if (!hasReleaseDates(gpuSlug1, gpuSlug2)) {
        skippedBecauseReleaseDate++;
        continue;
      }

      // Skip urls where a CPU is missing benchmarks
      if (!hasBenchmarks(gpuSlug1, gpuSlug2)) {
        skippedBecauseBenchmarks++;
        continue;
      }

      // Skip urls where it doesn't make sense to compare market segments
      if (!hasSimilarMarketSegments(gpuSlug1, gpuSlug2)) {
        skippedBecauseMarketSegments++;
        continue;
      }

      // Skip urls where they released in significantly different times
      if (!isWithinTimeDelta(gpuSlug1, gpuSlug2, MAX_YEARS_DIFFERENCE)) {
        skippedBecauseTimeDelta++;
        continue;
      }

      const url = websiteUrl(
        getCompareGpusPath({
          productType: ProductType.Gpu,
          comparison: [
            { id: gpuSlug1.productId, slug: gpuSlug1.slug },
            { id: gpuSlug2.productId, slug: gpuSlug2.slug },
          ],
          ordered: true,
        }),
      );

      urls.push(url);
      totalEntries += 1;
    }
  }

  const hashSize = getComparisonHashSize(urls.length);
  const sitemapIndexEntries: SitemapIndexEntry[] = [];
  const entries: Record<string, SitemapEntry[]> = {};
  for (const url of urls) {
    const sitemapName = getSitemapName(url, hashSize);

    if (!entries[sitemapName]) {
      entries[sitemapName] = [];
    }

    entries[sitemapName].push({ url });
  }

  const sitemapNames = Object.keys(entries);
  for (const name of sitemapNames) {
    const filename = GPU_COMPARISONS_FILENAME.replace('{i}', `${name}`);
    await writeSitemap(prioritySitemapPath(filename), entries[name]);
    const url = sitemapUrl(filename, { compressed: true });
    sitemapIndexEntries.push({ url });
    console.log(`Generated ${filename} with ${entries[name].length} entries`);
  }

  console.log(`${totalEntries} total entries for GPU Comparison sitemaps.`);
  console.log(
    `${skippedBecauseReleaseDate} skipped because of missing release date.`,
  );
  console.log(
    `${skippedBecauseBenchmarks} skipped because of missing benchmarks.`,
  );
  console.log(
    `${skippedBecauseMarketSegments} skipped because of non-similar market segments.`,
  );
  console.log(
    `${skippedBecauseTimeDelta} skipped because of release date delta.`,
  );

  return sitemapIndexEntries;
}

// Sitemap Utils

async function writeSitemapIndex(sitemapIndexEntries: SitemapIndexEntry[]) {
  const items = sitemapIndexEntries.map((entry) =>
    generateSitemapIndexEntryObject(entry),
  );

  const indexObject = {
    sitemapindex: [
      { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } },
      ...items,
    ],
  };

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n${xml(
    indexObject,
    { indent: ' ' },
  )}`;

  const path = prioritySitemapPath(INDEX_FILENAME);
  const compressedPath = `${path}.gz`;
  await fsPromises.writeFile(path, sitemapIndex, 'utf-8');
  await compressSitemap(path, compressedPath);
  console.log(`Generated sitemap index at ${compressedPath}`);
}

async function writeSitemap(path: string, entries: SitemapEntry[]) {
  const items = entries.map((entry) => generateSitemapUrlObject(entry));

  const sitemapObject = {
    urlset: [
      { _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } },
      ...items,
    ],
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n${xml(
    sitemapObject,
    { indent: ' ' },
  )}`;
  await fsPromises.writeFile(path, sitemap, 'utf-8');
  await compressSitemap(path, `${path}.gz`);
}

async function removeExistingSitemaps() {
  const paths = await fsPromises.readdir(prioritySitemapPath());
  console.log(`Removing existing ${paths} sitemaps`);
  for (const path of paths) {
    await fsPromises.rm(prioritySitemapPath(path));
  }
}

function generateSitemapIndexEntryObject(entry: SitemapIndexEntry) {
  return { sitemap: [{ loc: entry.url }] };
}

function generateSitemapUrlObject(entry: SitemapEntry) {
  return { url: [{ loc: entry.url }] };
}

async function compressSitemap(path: string, output: string) {
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(zlib.createGzip({ level: 9 }))
      .pipe(fs.createWriteStream(output))
      .on('error', () => reject())
      .on('finish', () => resolve());
  });
  await fsPromises.rm(path);
}

async function fetchProductSlugs(
  request: GetSitemapProductSlugsRequest,
  context: AutomationContext,
) {
  const response = await context.api.get<GetSitemapProductSlugsResponse>(
    'website/sitemap/product-slugs',
    {},
    { params: { req: JSON.stringify(request) } },
  );
  return response.slugs;
}

async function uploadSitemaps(context: AutomationContext) {
  const files = await fsPromises.readdir(prioritySitemapPath());
  const promises: ConcurrentFn[] = [];
  for (const file of files) {
    promises.push(() => uploadSitemap(prioritySitemapPath(file), context));
  }
  await concurrent(promises, {
    limit: FILES_PER_UPLOAD,
    delayBetweenChunksMs: DELAY_BETWEEN_UPLOAD,
  });
}

async function uploadSitemap(path: string, context: AutomationContext) {
  try {
    const data = new FormData();
    data.append('file', fs.createReadStream(path));
    console.log(`Uploading sitemap: ${path}`);
    await context.api.post(
      'website/priority-sitemap',
      data,
      {},
      {
        headers: { 'content-type': 'multipart/form-data' },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    );
    console.log(`Uploaded ${path}`);
  } catch (err) {
    console.error(`Could not upload: ${path}`);
    console.error(err);
  }
}

function generateUuid(value: string) {
  return uuid.v3(value, '00000000-0000-0000-0000-000000000000');
}

function getSitemapName(url: string, size: number) {
  const uuid = generateUuid(url);
  return uuid.substring(0, size) || '0';
}

function getComparisonHashSize(totalUrls: number) {
  if (totalUrls > 10_000_000) {
    return 3;
  } else if (totalUrls > 700_000) {
    return 2;
  } else {
    return 1;
  }
}

function hasReleaseDates(slug1: SitemapProductSlug, slug2: SitemapProductSlug) {
  return slug1.releaseDate != null && slug2.releaseDate != null;
}

function hasBenchmarks(slug1: SitemapProductSlug, slug2: SitemapProductSlug) {
  return slug1.hasBenchmarks && slug2.hasBenchmarks;
}

function isWithinTimeDelta(
  slug1: SitemapProductSlug,
  slug2: SitemapProductSlug,
  maxDelta: number,
) {
  if (!hasReleaseDates(slug1, slug2)) {
    return false;
  }

  const time1 = parse(slug1.releaseDate, 'yyyy-MM-dd', new Date()).getTime();
  const time2 = parse(slug2.releaseDate, 'yyyy-MM-dd', new Date()).getTime();
  const delta = Math.abs(time1 - time2);
  if (delta > maxDelta) {
    return false;
  }

  return true;
}

function hasSimilarMarketSegments(
  slug1: SitemapProductSlug,
  slug2: SitemapProductSlug,
) {
  if (slug1.marketSegment == null || slug2.marketSegment == null) {
    return false;
  }

  if (slug1.marketSegment === MarketSegment.Desktop) {
    return [MarketSegment.Desktop, MarketSegment.Workstation].includes(
      slug2.marketSegment,
    );
  } else if (slug1.marketSegment === MarketSegment.Embedded) {
    return [
      MarketSegment.Embedded,
      MarketSegment.Integrated,
      MarketSegment.Mobile,
    ].includes(slug2.marketSegment);
  } else if (slug1.marketSegment === MarketSegment.Integrated) {
    return [
      MarketSegment.Embedded,
      MarketSegment.Integrated,
      MarketSegment.Mobile,
    ].includes(slug2.marketSegment);
  } else if (slug1.marketSegment === MarketSegment.Mobile) {
    return [
      MarketSegment.Embedded,
      MarketSegment.Integrated,
      MarketSegment.Mobile,
    ].includes(slug2.marketSegment);
  } else if (slug1.marketSegment === MarketSegment.Server) {
    return [MarketSegment.Server, MarketSegment.Workstation].includes(
      slug2.marketSegment,
    );
  } else if (slug1.marketSegment === MarketSegment.Workstation) {
    return [
      MarketSegment.Desktop,
      MarketSegment.Server,
      MarketSegment.Workstation,
    ].includes(slug2.marketSegment);
  }

  return false;
}
